// src/services/reportClientService.js
import apiClient from './apiClient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const createReport = async (reportData) => {
  try {
    const response = await apiClient.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.error('Create report error:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Error creating report';
  }
};

// Dans reportClientService.js
export const getReports = async () => {
  try {
    const response = await apiClient.get('/reports');
    
    // Préfixer les chemins d'images avec la base URL
    const data = response.data.map(report => ({
      ...report,
      images: report.images.map(imageUri => {
        if (imageUri.startsWith('/uploads/')) {
          return `${apiClient.defaults.baseURL.replace('/api', '')}${imageUri}`;
        }
        return imageUri;
      }),
      signature: report.signature && report.signature.startsWith('/uploads/') 
        ? `${apiClient.defaults.baseURL.replace('/api', '')}${report.signature}`
        : report.signature
    }));
    
    return data;
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

export const downloadReportPDF = async (reportId) => {
  try {
    if (Platform.OS === 'web') {
      // Pour le web, ouvrir dans un nouvel onglet
      const token = await AsyncStorage.getItem('authToken');
      const url = `${apiClient.defaults.baseURL}/reports/${reportId}/pdf`;
      
      // Créer un élément a temporaire pour le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${reportId}.pdf`;
      
      // Ajouter l'en-tête d'autorisation via fetch
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      
      return { success: true };
    } else {
    // Créer le chemin de destination
    const fileUri = `${FileSystem.documentDirectory}rapport_${reportId}.pdf`;
    
    const token = await AsyncStorage.getItem('authToken');
    // Télécharger le fichier
    const downloadResumable = FileSystem.createDownloadResumable(
      `${apiClient.defaults.baseURL}/reports/${reportId}/pdf`,
      fileUri,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const { uri } = await downloadResumable.downloadAsync();
    
    // Partager/ouvrir le fichier
    await Sharing.shareAsync(uri);
    
    return { success: true };
  }
  } catch (error) {
    console.error('Download report PDF error:', error);
    throw error.response?.data?.error || 'Error downloading report as PDF';
  }
};