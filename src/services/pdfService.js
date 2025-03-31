// src/services/pdfService.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { query } = require('./dbService');
const axios = require('axios');
const sharp = require('sharp'); // Assurez-vous d'installer cette dépendance avec: npm install sharp

// Définir les constantes pour les dossiers
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const TEMP_DIR = path.join(__dirname, '../temp');

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Fonction pour récupérer une image à partir d'une URI ou d'une chaîne base64
async function fetchImage(imageURI) {
  try {
    console.log('Fetching image:', imageURI);
    
    if (!imageURI) {
      console.error('Image URI is undefined or null');
      return null;
    }
    
    // Si c'est une data URI (base64), convertir directement
    if (imageURI.startsWith('data:image')) {
      try {
        const base64Data = imageURI.split(',')[1];
        if (base64Data) {
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Si c'est un webp, convertir en png
          if (imageURI.includes('webp')) {
            return await sharp(buffer).png().toBuffer();
          }
          
          return buffer;
        }
      } catch (err) {
        console.error('Error processing data URI:', err);
        return null;
      }
    }
    
    // Si c'est un chemin relatif commençant par /uploads/
    if (imageURI.startsWith('/uploads/')) {
      try {
        let filePath = null;
        // Essayer le chemin absolu depuis la racine du projet
        const absolutePath = path.join(__dirname, '..', '..', imageURI);
        console.log('Loading image from absolute path:', absolutePath);
        
        // Vérifier si un chemin alternatif existe
        if (!fs.existsSync(absolutePath)) {
          const altPath = path.join(__dirname, '..', imageURI);
          console.log('Trying alternative path:', altPath);
          
          if (fs.existsSync(altPath)) {
            filePath = altPath;
          } else {
            console.error('Image file not found at both paths');
            return null;
          }
        } else {
          filePath = absolutePath;
        }
        
        // Obtenir l'extension du fichier
        const ext = path.extname(filePath).toLowerCase();
        
        // Si c'est un webp, convertir en png
        if (ext === '.webp') {
          console.log('Converting WebP to PNG for compatibility with PDFKit');
          return await sharp(filePath).png().toBuffer();
        }
        
        return fs.readFileSync(filePath);
      } catch (err) {
        console.error('Error reading file:', err);
        return null;
      }
    }
    
    // Si l'URI est une URL complète
    if (imageURI.startsWith('http://') || imageURI.startsWith('https://')) {
      try {
        const response = await axios.get(imageURI, { 
          responseType: 'arraybuffer',
          timeout: 5000
        });
        
        // Vérifier si c'est un WebP en examinant l'en-tête Content-Type
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('webp')) {
          return await sharp(Buffer.from(response.data)).png().toBuffer();
        }
        
        return Buffer.from(response.data);
      } catch (err) {
        console.error('Error fetching image from URL:', err);
        return null;
      }
    }
    
    // Si c'est un chemin de fichier local (inaccessible)
    if (imageURI.startsWith('file://')) {
      console.error('Cannot access local device file:', imageURI);
      return null;
    }
    
    console.error('Unhandled image URI format:', imageURI);
    return null;
  } catch (error) {
    console.error('Error fetching image:', error.message);
    return null;
  }
}

// Fonction principale pour générer un PDF à partir d'un rapport
exports.generateReportPDF = async (reportId, userId) => {
  try {
    console.log(`Generating PDF for report ${reportId} by user ${userId}`);
    
    // Récupérer les données du rapport
    const reportData = await query(
      `SELECT * FROM reports WHERE id = ? AND created_by = ?`,
      [reportId, userId]
    );
    
    if (reportData.length === 0) {
      throw new Error('Rapport non trouvé');
    }
    
    const report = reportData[0];
    
    // Récupérer les images associées au rapport directement depuis la table images
    const imagesData = await query(
      `SELECT * FROM images WHERE report_id = ? ORDER BY id ASC`,
      [reportId]
    );
    
    console.log(`Found ${imagesData.length} images for report ${reportId}`);
    
    // Récupérer la signature associée au rapport
    const signatureData = await query(
      `SELECT * FROM signatures WHERE report_id = ? LIMIT 1`,
      [reportId]
    );
    
    const hasSignature = signatureData.length > 0;
    console.log(`Signature found: ${hasSignature}`);
    
    // Créer un document PDF
    const pdfPath = path.join(__dirname, `../temp/report_${reportId}.pdf`);
    const doc = new PDFDocument({ 
      margin: 50, 
      size: 'A4',
      bufferPages: true // Activer le buffer des pages pour pouvoir ajouter des pieds de page
    });
    
    // Pipe le PDF dans un fichier temporaire
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    
    // Ajouter l'en-tête
    doc.fontSize(25).text('Rapport d\'intervention', { align: 'center' });
    doc.moveDown();
    
    // Ajouter les informations du client
    doc.fontSize(14).text('Informations client', { underline: true });
    doc.fontSize(12).text(`Client: ${report.client_name}`);
    doc.text(`Date d'intervention: ${new Date(report.intervention_date).toLocaleDateString()}`);
    doc.text(`Adresse: ${report.address}`);
    doc.moveDown();
    
    // Ajouter les détails de l'intervention
    if (report.issue) {
      doc.fontSize(14).text('Problème signalé', { underline: true });
      doc.fontSize(12).text(report.issue);
      doc.moveDown();
    }
    
    if (report.description) {
      doc.fontSize(14).text('Description du problème', { underline: true });
      doc.fontSize(12).text(report.description);
      doc.moveDown();
    }
    
    if (report.actions) {
      doc.fontSize(14).text('Actions effectuées', { underline: true });
      doc.fontSize(12).text(report.actions);
      doc.moveDown();
    }
    
    if (report.materials) {
      doc.fontSize(14).text('Matériels utilisés', { underline: true });
      doc.fontSize(12).text(report.materials);
      doc.moveDown();
    }
    
    // Ajouter les images si présentes
    if (imagesData.length > 0) {
      doc.addPage();
      doc.fontSize(14).text('Photos', { underline: true });
      doc.moveDown();
      
      // Dimensions pour les images
      const maxWidth = 500;
      const maxHeight = 350;
      
      // Ajouter chaque image
      for (let i = 0; i < imagesData.length; i++) {
        try {
          console.log(`Processing image ${i+1}/${imagesData.length}`);
          const imageUri = imagesData[i].image_uri;
          const imageBuffer = await fetchImage(imageUri);
          
          if (imageBuffer) {
            // Ajouter un titre pour l'image
            const imageType = imagesData[i].image_type || 'other';
            const imageTitle = imageType === 'problem' ? 'Image du problème' : 
                              imageType === 'action' ? 'Image de la réparation' : 
                              `Image ${i + 1}`;
            
            doc.fontSize(12).text(imageTitle, { underline: true });
            doc.moveDown(0.5);
            
            // Calculer la position pour l'image
            const startY = doc.y;
            
            // Vérifier si l'image tiendra sur la page actuelle
            if (startY + maxHeight > doc.page.height - 100) {
              doc.addPage();
            }
            
            // Ajouter l'image au PDF
            doc.image(imageBuffer, {
              fit: [maxWidth, maxHeight],
              align: 'center'
            });
            
            doc.moveDown(2);
          } else {
            console.log(`Image ${i+1} could not be fetched`);
            doc.fontSize(12).text(`[Image ${i + 1} non disponible]`);
            doc.moveDown();
          }
        } catch (error) {
          console.error(`Error adding image ${i + 1}:`, error);
          doc.fontSize(12).text(`[Erreur lors du chargement de l'image ${i + 1}]`);
          doc.moveDown();
        }
      }
    }
    
    // Ajouter la signature sur une nouvelle page ou section
    if (hasSignature) {
      // Ajouter un espace supplémentaire pour séparer la signature des autres sections
      doc.moveDown(35);

      // Vérifier s'il y a besoin d'une nouvelle page pour la signature
      if (doc.y > doc.page.height - 200) {
        doc.addPage();
      } else {
        doc.moveDown(3); // Espace supplémentaire entre les images et la signature
      }
      
      doc.fontSize(14).text('Signature du client', { underline: true });
      doc.moveDown();
      
      try {
        const signatureUri = signatureData[0].signature_uri;
        console.log('Signature URI:', signatureUri ? (signatureUri.substring(0, 30) + '...') : 'undefined');
        
        const signatureBuffer = await fetchImage(signatureUri);
        
        if (signatureBuffer) {
          // Définir une zone spécifique pour la signature
          doc.image(signatureBuffer, {
            fit: [200, 100],
            align: 'left'
          });
        } else {
          console.log('Signature image could not be fetched');
          doc.fontSize(12).text('Signature électronique capturée (non affichable)');
        }
      } catch (error) {
        console.error('Error adding signature:', error);
        doc.fontSize(12).text('Signature électronique capturée (erreur d\'affichage)');
      }
      
      doc.moveDown();
    }
    
    // Calculer le nombre total de pages
    const totalPages = doc.bufferedPageRange().count;
    
    // Ajouter un pied de page à chaque page
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      
      // Position en bas de page
      doc.fontSize(10)
         .text(
           `Rapport d'intervention #${reportId} - Page ${i + 1} sur ${totalPages}`,
           50,
           doc.page.height - 50,
           { align: 'center' }
         );
    }
    
    // Finaliser le PDF
    doc.end();
    
    // Attendre que le stream soit fermé
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log(`PDF successfully generated at ${pdfPath}`);
        resolve(pdfPath);
      });
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};