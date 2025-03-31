// src/services/interventionClientService.js
import apiClient from './apiClient';

export const getUpcomingInterventions = async () => {
  try {
    const response = await apiClient.get('/interventions/upcoming');
    return response.data;
  } catch (error) {
    console.error('Get upcoming interventions error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error fetching upcoming interventions';
  }
};

export const getOngoingInterventions = async () => {
  try {
    const response = await apiClient.get('/interventions/ongoing');
    return response.data;
  } catch (error) {
    console.error('Get ongoing interventions error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error fetching ongoing interventions';
  }
};

export const getInterventionHistory = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/interventions/history?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Get intervention history error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error fetching intervention history';
  }
};

export const createIntervention = async (interventionData) => {
  try {
    const response = await apiClient.post('/interventions', interventionData);
    return response.data;
  } catch (error) {
    console.error('Create intervention error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error creating intervention';
  }
};

export const updateInterventionStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/interventions/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Update intervention status error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error updating intervention status';
  }
};

export const getAllInterventions = async () => {
  const response = await apiClient.get('/interventions/all');
  return response.data;
};

export const updateIntervention = async (data) => {
  try {
    const id = typeof data.id === 'object' ? data.id.id : data.id;
    const { id: _, ...dataToSend } = data;
    const response = await apiClient.patch(`/interventions/${id}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error('Update intervention error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteIntervention = async (id) => {
  try {
    const interventionId = typeof id === 'object' && id !== null && id.id ? id.id : id;
    const response = await apiClient.delete(`/interventions/${interventionId}`);
    return response.data;
  } catch (error) {
    console.error('Delete intervention error:', error.response?.data || error.message);
    throw error;
  }
};