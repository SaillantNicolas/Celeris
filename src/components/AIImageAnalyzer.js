// src/components/AIImageAnalyzer.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, ActivityIndicator, Modal, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const AIImageAnalyzer = ({ 
  onAnalysisComplete, 
  onImagesSelected, 
  analyzeFunction,
  buttonText = "Analyser des images",
  modalTitle = "Analyser ces images ?"
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages(result.assets.map(asset => asset.uri));
      setModalVisible(true);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const analyzeImages = async () => {
    if (images.length === 0) return;
    
    setLoading(true);
    try {
      const analysis = await analyzeFunction(images);
      onAnalysisComplete(analysis);
      
      // Ajouter ces images à la galerie du rapport si nécessaire
      if (onImagesSelected) {
        onImagesSelected(images);
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur lors de l\'analyse des images:', error);
      
      let errorMessage = 'Une erreur est survenue lors de l\'analyse des images.';
      if (error.message) {
        errorMessage += ` Détail: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={pickImages}>
        <Ionicons name="image" size={20} color="#1F2631" />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            
            <ScrollView style={styles.imageScrollView}>
              <View style={styles.imageGrid}>
                {images.map((imageUri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={analyzeImages}
                disabled={loading || images.length === 0}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, { color: '#fff' }]}>Analyser</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Vos styles existants...
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginVertical: 5,
  },
  buttonText: {
    marginLeft: 5,
    color: '#1F2631',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imageScrollView: {
    width: '100%',
    maxHeight: 300,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    marginBottom: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#1F2631',
  },
});

export default AIImageAnalyzer;