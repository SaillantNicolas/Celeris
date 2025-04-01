const { query } = require("./dbService");

exports.getUpcomingInterventions = async (userId) => {
  try {
    return await query(
      `SELECT * FROM interventions 
       WHERE assigned_user_id = ? 
       AND status = 'scheduled' 
       AND scheduled_date >= NOW()
       ORDER BY scheduled_date ASC`,
      [userId]
    );
  } catch (error) {
    console.error("Error fetching upcoming interventions:", error);
    throw error;
  }
};

exports.getOngoingInterventions = async (userId) => {
  try {
    return await query(
      `SELECT * FROM interventions 
       WHERE assigned_user_id = ? 
       AND status = 'in_progress'
       ORDER BY scheduled_date ASC`,
      [userId]
    );
  } catch (error) {
    console.error("Error fetching ongoing interventions:", error);
    throw error;
  }
};

exports.getInterventionHistory = async (userId, limit = 5) => {
  try {
    return await query(
      `SELECT * FROM interventions 
       WHERE assigned_user_id = ? 
       AND status = 'completed'
       ORDER BY scheduled_date DESC
       LIMIT ?`,
      [userId, limit]
    );
  } catch (error) {
    console.error("Error fetching intervention history:", error);
    throw error;
  }
};

exports.createIntervention = async (data) => {
  const {
    client,
    address,
    issue = "",
    scheduled_date,
    status = "scheduled",
    assignedUserId,
  } = data;

  if (!client || !address || !scheduled_date || !assignedUserId) {
    throw new Error("Champs obligatoires manquants");
  }

  const formattedDate = new Date(scheduled_date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const sql = `
    INSERT INTO interventions (client, address, issue, scheduled_date, status, assigned_user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return await query(sql, [
    client,
    address,
    issue,
    formattedDate,
    status,
    assignedUserId,
  ]);
};

exports.updateIntervention = async (id, data, userId) => {
  id = parseInt(id, 10);

  const { client, address, issue, scheduled_date, status } = data;

  if (!client || !address || !scheduled_date || !status) {
    console.error("[updateIntervention] Champ manquant", {
      id,
      client,
      address,
      scheduled_date,
      status,
      userId,
    });
    throw new Error("Champs manquants ou invalides");
  }

  const sql = `
    UPDATE interventions 
    SET client = ?, address = ?, issue = ?, scheduled_date = ?, status = ? 
    WHERE id = ? AND assigned_user_id = ?
  `;

  return await query(sql, [
    client,
    address,
    issue || null,
    scheduled_date,
    status,
    id,
    userId,
  ]);
};

exports.getAllInterventions = async (userId) => {
  return await query(`SELECT * FROM interventions WHERE assigned_user_id = ?`, [
    userId,
  ]);
};

exports.deleteIntervention = async (id, userId) => {
  if (!id || !userId) {
    console.error("ID ou user manquant pour la suppression:", { id, userId });
    throw new Error("ID ou user manquant");
  }
  id = parseInt(id, 10);

  if (isNaN(id)) {
    console.error("ID invalide pour la suppression:", id);
    throw new Error("ID invalide");
  }

  console.log("Suppression de l'intervention:", { id, userId });

  const sql = `DELETE FROM interventions WHERE id = ? AND assigned_user_id = ?`;
  const result = await query(sql, [id, userId]);

  console.log("Résultat de la suppression:", result);

  if (result.affectedRows === 0) {
    throw new Error("Intervention non trouvée ou non autorisée");
  }

  return { success: true, message: "Intervention supprimée avec succès" };
};
