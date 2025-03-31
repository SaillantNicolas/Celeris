// Modification de src/screens/ReportsListScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getReports, downloadReportPDF } from '../services/reportClientService';

const ReportsListScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les rapports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (reportId) => {
    try {
      setDownloading(true);
      await downloadReportPDF(reportId);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Erreur', 'Impossible de télécharger le PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <TouchableOpacity 
        style={styles.reportContent}
        onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}
      >
        <Text style={styles.clientName}>{item.client_name}</Text>
        <Text style={styles.reportDate}>
          {new Date(item.intervention_date).toLocaleDateString()}
        </Text>
        <Text style={styles.reportAddress}>{item.address}</Text>
      </TouchableOpacity>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => handleDownloadPDF(item.id)}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#1F2631" />
          ) : (
            <Ionicons name="download-outline" size={24} color="#1F2631" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1F2631" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes rapports</Text>
        <TouchableOpacity onPress={fetchReports}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {reports.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Aucun rapport disponible</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
  listContainer: {
    padding: 16,
  },
  reportItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportContent: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  reportAddress: {
    fontSize: 14,
    color: '#777',
  },
  actionsContainer: {
    justifyContent: 'center',
    marginLeft: 16,
  },
  downloadButton: {
    padding: 8,
  },
});

export default ReportsListScreen;