import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ImageUploader from '../components/ImageUploader';
import SignaturePad from '../components/SignaturePad';

const CreateReportScreen = () => {
  const [clientName, setClientName] = useState('');
  const [interventionDate, setInterventionDate] = useState('');

  const handleSubmit = () => {
    console.log('Nom du client:', clientName);
    console.log('Date d’intervention:', interventionDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du client :</Text>
      <TextInput
        style={styles.input}
        value={clientName}
        onChangeText={setClientName}
        placeholder="Entrez le nom du client"
      />
      <Text style={styles.label}>Date d’intervention :</Text>
      <TextInput
        style={styles.input}
        value={interventionDate}
        onChangeText={setInterventionDate}
        placeholder="Entrez la date"
      />
      <ImageUploader />
      <SignaturePad onOK={(signature) => console.log('Signature:', signature)} />
      <Button title="Soumettre" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
});

export default CreateReportScreen;
