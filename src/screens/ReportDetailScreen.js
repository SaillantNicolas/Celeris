import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getReportById } from '../services/reportClientService';

const ReportDetailScreen = ({ route, navigation }) => {
  const { reportId } = route.params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await getReportById(reportId);
      setReport(data);
      setError(null);
    } catch (err) {
      console.error('Error loading report details:', err);
      setError('Impossible de charger les détails du rapport. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const shareReport = async () => {
    try {
      await Share.share({
        title: `Rapport d'intervention - ${report.client_name}`,
        message: `
          Rapport d'intervention du ${formatDate(report.intervention_date)}
          
          Client: ${report.client_name}
          Adresse: ${report.address}
          
          Problème: ${report.issue || 'Non spécifié'}
          
          Description: 
          ${report.description || 'Aucune description fournie'}
          
          Actions réalisées:
          ${report.actions || 'Aucune action spécifiée'}
          
          Matériels utilisés:
          ${report.materials || 'Aucun matériel spécifié'}
        `
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager ce rapport');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1F2631" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadReport}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Rapport introuvable</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du rapport</Text>
        <TouchableOpacity onPress={shareReport}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Informations client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations client</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client :</Text>
              <Text style={styles.infoValue}>{report.client_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date :</Text>
              <Text style={styles.infoValue}>{formatDate(report.intervention_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adresse :</Text>
              <Text style={styles.infoValue}>{report.address}</Text>
            </View>
            {report.issue && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Problème :</Text>
                <Text style={styles.infoValue}>{report.issue}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description du problème */}
        {report.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description du problème</Text>
            <View style={styles.textCard}>
              <Text style={styles.textContent}>{report.description}</Text>
            </View>
          </View>
        )}

        {/* Actions effectuées */}
        {report.actions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions effectuées</Text>
            <View style={styles.textCard}>
              <Text style={styles.textContent}>{report.actions}</Text>
            </View>
          </View>
        )}

        {/* Matériels utilisés */}
        {report.materials && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Matériels utilisés</Text>
            <View style={styles.textCard}>
              <Text style={styles.textContent}>{report.materials}</Text>
            </View>
          </View>
        )}

        {/* Images */}
        {report.images && report.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView horizontal style={styles.imagesContainer}>
              {report.images.map((uri, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => Alert.alert('Image', 'Fonctionnalité de zoom à venir')}
                >
                  <Image source={{ uri }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Signature */}
        {report.signature && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Signature du client</Text>
            <View style={styles.signatureContainer}>
              <Image source={{ uri: report.signature }} style={styles.signature} resizeMode="contain" />
            </View>
          </View>
        )}

        {/* Date de création */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Rapport créé le {formatDate(report.created_at)}
          </Text>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2631',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: '30%',
    color: '#555',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  textCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContent: {
    lineHeight: 22,
    color: '#333',
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
  signatureContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signature: {
    width: '100%',
    height: 150,
  },
  footerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#777',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1F2631',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#1F2631',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReportDetailScreen;