// src/services/interventionService.js
const { query } = require('./dbService');

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
    console.error('Error fetching upcoming interventions:', error);
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
    console.error('Error fetching ongoing interventions:', error);
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
    console.error('Error fetching intervention history:', error);
    throw error;
  }
};

exports.createIntervention = async (interventionData) => {
  try {
    const result = await query(
      `INSERT INTO interventions 
       (client, address, issue, scheduled_date, status, assigned_user_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        interventionData.client,
        interventionData.address,
        interventionData.issue,
        interventionData.scheduledDate,
        interventionData.status || 'scheduled',
        interventionData.assignedUserId
      ]
    );
    
    return { success: true, interventionId: result.insertId };
  } catch (error) {
    console.error('Error creating intervention:', error);
    throw error;
  }
};

exports.updateInterventionStatus = async (id, status, userId) => {
  try {
    await query(
      'UPDATE interventions SET status = ? WHERE id = ? AND assigned_user_id = ?',
      [status, id, userId]
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating intervention status:', error);
    throw error;
  }
};