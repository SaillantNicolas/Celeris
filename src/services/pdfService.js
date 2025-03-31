const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { query } = require('./dbService');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const TEMP_DIR = path.join(__dirname, '../temp');
const CELERIS_LOGO_PATH = path.join(__dirname, '../../assets/CELERIS.png');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function fetchImage(imageURI) {
  try {
    if (!imageURI) return null;

    if (imageURI.startsWith('data:image')) {
      const base64Data = imageURI.split(',')[1];
      if (base64Data) {
        const buffer = Buffer.from(base64Data, 'base64');
        return imageURI.includes('webp') ? await sharp(buffer).png().toBuffer() : buffer;
      }
    }

    if (imageURI.startsWith('/uploads/')) {
      const absPath = path.join(__dirname, '..', '..', imageURI);
      const altPath = path.join(__dirname, '..', imageURI);
      const finalPath = fs.existsSync(absPath) ? absPath : fs.existsSync(altPath) ? altPath : null;
      if (!finalPath) return null;

      const ext = path.extname(finalPath).toLowerCase();
      return ext === '.webp'
        ? await sharp(finalPath).png().toBuffer()
        : fs.readFileSync(finalPath);
    }

    if (imageURI.startsWith('http://') || imageURI.startsWith('https://')) {
      const res = await axios.get(imageURI, { responseType: 'arraybuffer', timeout: 5000 });
      return res.headers['content-type']?.includes('webp')
        ? await sharp(Buffer.from(res.data)).png().toBuffer()
        : Buffer.from(res.data);
    }

    return null;
  } catch (err) {
    console.error('fetchImage error:', err);
    return null;
  }
}

exports.generateReportPDF = async (reportId, userId) => {
  try {
    const reportData = await query(`SELECT * FROM reports WHERE id = ? AND created_by = ?`, [reportId, userId]);
    if (reportData.length === 0) throw new Error('Rapport non trouvé');

    const report = reportData[0];
    const images = await query(`SELECT * FROM images WHERE report_id = ? ORDER BY id ASC`, [reportId]);
    const signature = await query(`SELECT * FROM signatures WHERE report_id = ? LIMIT 1`, [reportId]);

    const pdfPath = path.join(TEMP_DIR, `report_${reportId}.pdf`);
    const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Logo
    if (fs.existsSync(CELERIS_LOGO_PATH)) {
      doc.image(CELERIS_LOGO_PATH, doc.page.width - 130, 30, { fit: [80, 40] });
    }

    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(20).text('Rapport d\'intervention', { align: 'center' });
    doc.moveDown(1);

    // Section helper
    const section = (title, content) => {
      if (!content) return;
      doc.font('Helvetica-Bold').fontSize(14).fillColor('#1F2631').text(title);
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(12).fillColor('black').text(content);
      doc.moveDown();
      doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
      doc.moveDown();
    };

    // Infos
    section('Informations client', `Client : ${report.client_name}\nDate d'intervention : ${new Date(report.intervention_date).toLocaleDateString('fr-FR')}\nAdresse : ${report.address}`);
    section('Problème signalé', report.issue);
    section('Description du problème', report.description);
    section('Actions effectuées', report.actions);
    section('Matériels utilisés', report.materials);

    // Images
    if (images.length > 0) {
      doc.addPage();
      doc.font('Helvetica-Bold').fontSize(16).text('Photos');
      doc.moveDown();

      const maxWidth = 500;
      const maxHeight = 350;

      for (let i = 0; i < images.length; i++) {
        const imgTitle = images[i].image_type === 'problem'
          ? 'Image du problème'
          : images[i].image_type === 'action'
            ? 'Image de la réparation'
            : `Image ${i + 1}`;

        const buffer = await fetchImage(images[i].image_uri);
        doc.font('Helvetica-Bold').fontSize(12).text(imgTitle);
        doc.moveDown(0.5);

        if (buffer) {
          if (doc.y + maxHeight > doc.page.height - 100) doc.addPage();
          doc.image(buffer, { fit: [maxWidth, maxHeight], align: 'center' });
        } else {
          doc.font('Helvetica').fontSize(12).text('[Image non disponible]');
        }
        doc.moveDown(1);
      }
    }

    // Signature
    if (signature.length > 0) {
      doc.addPage();
      doc.font('Helvetica-Bold').fontSize(16).text('Signature du client');
      doc.moveDown(1);
      const sigBuffer = await fetchImage(signature[0].signature_uri);
      if (sigBuffer) {
        doc.image(sigBuffer, { fit: [250, 120], align: 'left' });
      } else {
        doc.font('Helvetica').fontSize(12).text('Signature non disponible.');
      }
    }

    // Footer
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc.font('Helvetica').fontSize(10).fillColor('#999').text(
        `Rapport d'intervention #${reportId} - Page ${i + 1} sur ${totalPages}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );
    }

    doc.end();
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(pdfPath));
      stream.on('error', reject);
    });
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    throw error;
  }
};
