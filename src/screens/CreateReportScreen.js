import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageUploader from '../components/ImageUploader';
import SignaturePad from '../components/SignaturePad';
import ButtonCeleris from '../utils/ButtonCeleris';

const CreateReportScreen = ({ navigation, route }) => {
  const intervention = route.params?.intervention || {};
  
  const [form, setForm] = useState({
    clientName: intervention.client || '',
    interventionDate: new Date().toISOString().slice(0, 10),
    address: intervention.address || '',
    issue: intervention.issue || '',
    description: '',
    actions: '',
    materials: '',
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Données du rapport:', form);
    // Ici, vous ajouterez la logique d'envoi du formulaire
    alert('Rapport créé avec succès!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau rapport</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Informations client</Text>
        
        <Text style={styles.label}>Nom du client:</Text>
        <TextInput
          style={styles.input}
          value={form.clientName}
          onChangeText={(value) => handleChange('clientName', value)}
          placeholder="Nom du client"
        />

        <Text style={styles.label}>Date d'intervention:</Text>
        <TextInput
          style={styles.input}
          value={form.interventionDate}
          onChangeText={(value) => handleChange('interventionDate', value)}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Adresse:</Text>
        <TextInput
          style={styles.input}
          value={form.address}
          onChangeText={(value) => handleChange('address', value)}
          placeholder="Adresse complète"
        />

        <Text style={styles.label}>Problème signalé:</Text>
        <TextInput
          style={styles.input}
          value={form.issue}
          onChangeText={(value) => handleChange('issue', value)}
          placeholder="Description du problème"
        />

        <Text style={styles.sectionTitle}>Détails de l'intervention</Text>

        <Text style={styles.label}>Description du problème constaté:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Description détaillée"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Actions effectuées:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.actions}
          onChangeText={(value) => handleChange('actions', value)}
          placeholder="Liste des actions réalisées"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Matériels utilisés:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.materials}
          onChangeText={(value) => handleChange('materials', value)}
          placeholder="Liste des pièces et matériels"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Photos</Text>
        <ImageUploader />

        <Text style={styles.sectionTitle}>Signature du client</Text>
        <SignaturePad onOK={(signature) => console.log('Signature:', signature)} />

        <View style={styles.buttonContainer}>
          <ButtonCeleris
            title="ENREGISTRER"
            onPress={handleSubmit}
            backgroundColor="#1F2631"
            Color="#fff"
            BorderColor="#fff"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2631',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1F2631',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginVertical: 20,
  },
});

export default CreateReportScreen;