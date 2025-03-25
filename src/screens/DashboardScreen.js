import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUpcomingInterventions, getOngoingInterventions, getInterventionHistory } from '../services/interventionClientService';
import { logoutUser } from '../services/authClientService';

const DashboardScreen = ({ navigation }) => {
  const [upcomingInterventions, setUpcomingInterventions] = useState([]);
  const [ongoingInterventions, setOngoingInterventions] = useState([]);
  const [historyInterventions, setHistoryInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const upcoming = await getUpcomingInterventions();
        const ongoing = await getOngoingInterventions();
        const history = await getInterventionHistory(5);
        
        setUpcomingInterventions(upcoming);
        setOngoingInterventions(ongoing);
        setHistoryInterventions(history);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate('Home');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1F2631" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tableau de bord</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À venir</Text>
          {upcomingInterventions.length > 0 ? (
            upcomingInterventions.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => navigation.navigate('CreateReport', { intervention: item })}
              >
                <Text style={styles.clientName}>{item.client}</Text>
                <Text style={styles.details}>
                  {new Date(item.scheduled_date).toLocaleString()} | {item.issue}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucune intervention à venir</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interventions en cours</Text>
          {ongoingInterventions.length > 0 ? (
            ongoingInterventions.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => navigation.navigate('CreateReport', { intervention: item })}
              >
                <Text style={styles.clientName}>{item.client}</Text>
                <Text style={styles.details}>{item.address}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucune intervention en cours</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique</Text>
          {historyInterventions.length > 0 ? (
            historyInterventions.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => {}}
              >
                <Text style={styles.clientName}>{item.client}</Text>
                <Text style={styles.details}>{item.address}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucun historique d'intervention</Text>
          )}
          {historyInterventions.length > 0 && (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => {}}
            >
              <Text style={styles.viewMoreText}>VOIR PLUS</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.reportsButton}
            onPress={() => navigation.navigate('ReportsList')}
          >
            <Text style={styles.reportsButtonText}>Voir mes rapports</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#1F2631" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Ionicons name="search" size={24} color="#1F2631" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateReport')}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Ionicons name="chatbubbles" size={24} color="#1F2631" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Ionicons name="person" size={24} color="#1F2631" />
        </TouchableOpacity>
      </View>
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
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    color: '#666',
    marginTop: 5,
  },
  viewMoreButton: {
    alignItems: 'center',
    padding: 10,
  },
  viewMoreText: {
    color: '#1F2631',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    padding: 10,
  },
  addButton: {
    backgroundColor: '#1F2631',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default DashboardScreen;