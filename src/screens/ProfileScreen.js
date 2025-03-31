// src/screens/ProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", onPress: () => navigation.navigate('Home') }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header avec flèche retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 24 }} /> {/* Placeholder pour aligner */}
      </View>

      {/* Contenu profil */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ReportsList')}>
          <Ionicons name="document-text-outline" size={20} color="#1F2631" />
          <Text style={styles.buttonText}>Voir mes rapports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Alert.alert("À venir", "Modification de profil bientôt disponible.")}>
          <Ionicons name="create-outline" size={20} color="#1F2631" />
          <Text style={styles.buttonText}>Modifier mon profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Alert.alert("À venir", "Gestion de l’abonnement bientôt disponible.")}>
          <Ionicons name="card-outline" size={20} color="#1F2631" />
          <Text style={styles.buttonText}>Gestion de l’abonnement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#d11a2a" />
          <Text style={[styles.buttonText, { color: '#d11a2a' }]}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    padding: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#1F2631',
  },
});

export default ProfileScreen;
