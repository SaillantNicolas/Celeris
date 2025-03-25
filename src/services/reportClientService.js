// src/services/reportClientService.js
import apiClient from './apiClient';

export const createReport = async (reportData) => {
  try {
    const response = await apiClient.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Create report error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error creating report';
  }
};

export const getReports = async () => {
  try {
    const response = await apiClient.get('/reports');
    return response.data;
  } catch (error) {
    console.error('Get reports error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error fetching reports';
  }
};

export const getReportById = async (id) => {
  try {
    const response = await apiClient.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get report error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error fetching report';
  }
};