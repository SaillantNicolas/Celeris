import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllInterventions } from '../services/interventionClientService';
import { useFocusEffect } from '@react-navigation/native';

const InterventionListScreen = ({ navigation }) => {
  const [interventions, setInterventions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllInterventions();
        setInterventions(data);
        setFiltered(data);
      } catch (e) {
        console.error('Erreur chargement interventions:', e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    let result = interventions;
    if (filterStatus) {
      result = result.filter(i => i.status === filterStatus);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(i =>
        i.client.toLowerCase().includes(s) ||
        i.address.toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [filterStatus, search]);

  const fetchInterventions = async () => {
    try {
      const data = await getAllInterventions();
      setInterventions(data);
      setFiltered(applyFilters(data, filterStatus, search));
    } catch (e) {
      console.error('Erreur chargement interventions:', e);
      Alert.alert('Erreur', 'Impossible de charger les interventions');
    }
  };
  
  const applyFilters = (data, status, searchText) => {
    let result = [...data];
    if (status) {
      result = result.filter(i => i.status === status);
    }
    if (searchText) {
      const s = searchText.toLowerCase();
      result = result.filter(i =>
        i.client.toLowerCase().includes(s) ||
        i.address.toLowerCase().includes(s)
      );
    }
    return result;
  };

useFocusEffect(
  useCallback(() => {
    console.log('InterventionListScreen is focused, fetching data...');
    fetchInterventions();
    return () => {
    };
  }, [])
);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditIntervention', { intervention: item })}
    >
      <Text style={styles.client}>{item.client}</Text>
      <Text style={styles.details}>{new Date(item.scheduled_date).toLocaleString()} • {item.status}</Text>
      <Text style={styles.details}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Toutes les interventions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateIntervention')}>
          <Ionicons name="add-circle" size={32} color="#1F2631" />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TextInput
          placeholder="Recherche par client ou adresse"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <View style={styles.filterButtons}>
          {[ '', 'scheduled', 'in_progress', 'completed', 'cancelled' ].map(status => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              style={[styles.filterButton, filterStatus === status && styles.activeFilter]}
            >
              <Text style={styles.filterText}>{status === '' ? 'Tous' : status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff', 
        padding: 16,
        paddingTop: 50
    },
    headerRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16,
        marginTop: 10
    },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2631' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeFilter: {
    backgroundColor: '#1F2631',
  },
  filterText: {
    color: '#1F2631',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1F2631'
  },
  client: { fontSize: 16, fontWeight: 'bold' },
  details: { color: '#555', marginTop: 2 },
  list: { paddingBottom: 20 },
});

export default InterventionListScreen;
