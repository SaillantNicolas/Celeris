import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getUpcomingInterventions,
  getOngoingInterventions,
  getInterventionHistory,
} from "../services/interventionClientService";
import { logoutUser } from "../services/authClientService";

const DashboardScreen = ({ navigation }) => {
  const [upcoming, setUpcoming] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadInterventions = async () => {
        try {
          setLoading(true);
          const upcoming = await getUpcomingInterventions();
          const ongoing = await getOngoingInterventions();
          const history = await getInterventionHistory(10);

          setUpcoming(upcoming);
          setOngoing(ongoing);
          setHistory(history);
        } catch (error) {
          console.error("Erreur chargement dashboard:", error);
        } finally {
          setLoading(false);
        }
      };

      loadInterventions();
    }, [])
  );

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate("Home");
  };

  const renderSection = (title, data, emptyText, type) => (
    <View style={styles.section}>
      {data.slice(0, 5).map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("CreateReport", { intervention: item })
          }
        >
          <Text style={styles.clientName}>{item.client}</Text>
          <Text style={styles.details}>
            📍 {item.address} {"\n"}
            🗓️ {new Date(item.scheduled_date).toLocaleString("fr-FR")}
          </Text>
        </TouchableOpacity>
      ))}

      {data.length > 5 && (
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => {
            Alert.alert("À venir", `Voir toutes les interventions ${type}`);
          }}
        >
          <Text style={styles.viewMoreText}>VOIR TOUT</Text>
        </TouchableOpacity>
      )}

      {data.length === 0 && <Text style={styles.emptyText}>{emptyText}</Text>}
    </View>
  );

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
        <Text style={styles.headerTitle}>Tableau de bord</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderSection(
          "📆 Interventions à venir",
          upcoming,
          "Aucune intervention à venir.",
          "futures"
        )}
        {renderSection(
          "⚙️ En cours",
          ongoing,
          "Aucune intervention en cours.",
          "en_cours"
        )}
        {renderSection(
          "📜 Historique récent",
          history,
          "Aucun historique récent.",
          "passées"
        )}
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate("InterventionList")}
        >
          <Text style={styles.manageButtonText}>Gérer les interventions</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color="#1F2631" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Ionicons name="search" size={24} color="#1F2631" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateReport")}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Ionicons name="chatbubbles" size={24} color="#1F2631" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person" size={24} color="#1F2631" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1F2631",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    color: "#666",
    marginTop: 5,
  },
  viewMoreButton: {
    alignItems: "center",
    padding: 10,
  },
  viewMoreText: {
    color: "#1F2631",
    fontWeight: "bold",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#999",
    paddingVertical: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerButton: {
    padding: 10,
  },
  addButton: {
    backgroundColor: "#1F2631",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  manageButton: {
    backgroundColor: "#1F2631",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  manageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
