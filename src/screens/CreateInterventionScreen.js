import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import ButtonCeleris from "../utils/ButtonCeleris";
import { createIntervention } from "../services/interventionClientService";

const CreateInterventionScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    client: "",
    address: "",
    issue: "",
    scheduled_date: new Date(),
    status: "scheduled",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.client || !form.address || !form.scheduled_date) {
      Alert.alert(
        "Champs obligatoires",
        "Veuillez remplir les champs client, adresse et date"
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        scheduled_date: form.scheduled_date
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      };
      await createIntervention(payload);
      Alert.alert("Succès", "Intervention créée avec succès");
      navigation.goBack();
    } catch (error) {
      console.error("Erreur création intervention:", error);
      Alert.alert("Erreur", "Impossible de créer cette intervention");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle Intervention</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Client *</Text>
        <TextInput
          style={styles.input}
          value={form.client}
          onChangeText={(val) => handleChange("client", val)}
        />

        <Text style={styles.label}>Adresse *</Text>
        <TextInput
          style={styles.input}
          value={form.address}
          onChangeText={(val) => handleChange("address", val)}
        />

        <Text style={styles.label}>Problème</Text>
        <TextInput
          style={styles.input}
          value={form.issue}
          onChangeText={(val) => handleChange("issue", val)}
        />

        <Text style={styles.label}>Date d’intervention *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{form.scheduled_date.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.scheduled_date}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) handleChange("scheduled_date", date);
            }}
          />
        )}

        <Text style={styles.label}>Statut</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.status}
            onValueChange={(itemValue) => handleChange("status", itemValue)}
          >
            <Picker.Item label="Prévu" value="scheduled" />
            <Picker.Item label="En cours" value="in_progress" />
            <Picker.Item label="Terminé" value="completed" />
            <Picker.Item label="Annulé" value="cancelled" />
          </Picker>
        </View>

        <ButtonCeleris
          title={loading ? "Chargement..." : "Créer"}
          onPress={handleSubmit}
          backgroundColor="#1F2631"
          Color="#fff"
          BorderColor="#fff"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1F2631",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { padding: 16 },
  label: { marginTop: 15, marginBottom: 5, color: "#333", fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default CreateInterventionScreen;
