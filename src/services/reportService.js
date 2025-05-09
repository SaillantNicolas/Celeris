const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { query } = require("./dbService");

const UPLOADS_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

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

    return reports.map((report) => {
      return {
        ...report,
        images: report.images ? report.images.split(",") : [],
      };
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
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
      throw new Error("Rapport non trouvé");
    }

    const report = reports[0];
    return {
      ...report,
      images: report.images ? report.images.split(",") : [],
    };
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
};

async function saveImageToServer(imageData) {
  if (imageData.startsWith("data:")) {
    const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Format de données d'image invalide");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1] || "jpg";
    const fileName = `${uuidv4()}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    return `/uploads/${fileName}`;
  }

  if (imageData.startsWith("file://")) {
    console.error("Image inaccessible (chemin local):", imageData);
    return null;
  }

  if (imageData.startsWith("/uploads/")) {
    return imageData;
  }

  console.error("Format d'image non géré:", imageData);
  return null;
}

exports.createReport = async (reportData) => {
  try {
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
        reportData.createdBy,
      ]
    );

    const reportId = reportResult.insertId;

    if (reportData.images && reportData.images.length > 0) {
      for (const imageUri of reportData.images) {
        const savedImagePath = await saveImageToServer(imageUri);

        if (savedImagePath) {
          await query(
            "INSERT INTO images (report_id, image_uri, image_type) VALUES (?, ?, ?)",
            [reportId, savedImagePath, "other"]
          );
        }
      }
    }

    if (reportData.signature) {
      const savedSignaturePath = await saveImageToServer(reportData.signature);

      if (savedSignaturePath) {
        await query(
          "INSERT INTO signatures (report_id, signature_uri) VALUES (?, ?)",
          [reportId, savedSignaturePath]
        );
      }
    }

    return { success: true, reportId };
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};
