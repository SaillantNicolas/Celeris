// src/services/apiClient.js
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let BASE_URL;
if (Platform.OS === 'android') {
  // 10.0.2.2 est l'adresse spéciale pour localhost sur l'émulateur Android
  BASE_URL = 'http://10.0.2.2:3000/api';
} else if (Platform.OS === 'ios') {
  // Pour le simulateur iOS, localhost fonctionne
  BASE_URL = 'http://localhost:3000/api';
} else {
  // Pour les appareils physiques, utilisez votre adresse IP locale
  // IMPORTANT: Remplacez par votre propre adresse IP
  BASE_URL = 'http://localhost:3000/api'; // Remplacez X par votre adresse IP locale
}
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;