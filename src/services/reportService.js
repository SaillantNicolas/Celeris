// src/services/reportService.js
const { query } = require('./dbService');

exports.createReport = async (reportData) => {
  try {
    // Insérer le rapport
    const reportResult = await query(
      `INSERT INTO reports 
       (intervention_id, client_name, intervention_date, address, issue, description, actions, materials, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reportData.interventionId || null,
        reportData.clientName,
        reportData.interventionDate,
        reportData.address,
        reportData.issue,
        reportData.description,
        reportData.actions,
        reportData.materials,
        reportData.createdBy
      ]
    );
    
    const reportId = reportResult.insertId;
    
    // Insérer les images si présentes
    if (reportData.images && reportData.images.length > 0) {
      for (const imageUri of reportData.images) {
        await query(
          'INSERT INTO images (report_id, image_uri) VALUES (?, ?)',
          [reportId, imageUri]
        );
      }
    }
    
    // Insérer la signature si présente
    if (reportData.signature) {
      await query(
        'INSERT INTO signatures (report_id, signature_uri) VALUES (?, ?)',
        [reportId, reportData.signature]
      );
    }
    
    return { success: true, reportId };
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

exports.getReports = async (userId) => {
  try {
    const reports = await query(
      `SELECT r.*, 
        (SELECT GROUP_CONCAT(image_uri) FROM images WHERE report_id = r.id) as images,
        (SELECT signature_uri FROM signatures WHERE report_id = r.id LIMIT 1) as signature
       FROM reports r
       WHERE r.created_by = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    
    // Formater les données des images
    return reports.map(report => {
      return {
        ...report,
        images: report.images ? report.images.split(',') : []
      };
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

exports.getReportById = async (id, userId) => {
  try {
    const reports = await query(
      `SELECT r.*, 
        (SELECT GROUP_CONCAT(image_uri) FROM images WHERE report_id = r.id) as images,
        (SELECT signature_uri FROM signatures WHERE report_id = r.id LIMIT 1) as signature
       FROM reports r
       WHERE r.id = ? AND r.created_by = ?`,
      [id, userId]
    );
    
    if (reports.length === 0) {
      throw new Error('Rapport non trouvé');
    }
    
    const report = reports[0];
    return {
      ...report,
      images: report.images ? report.images.split(',') : []
    };
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};