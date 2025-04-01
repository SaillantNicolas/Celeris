import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import {
  updateIntervention,
  deleteIntervention,
} from "../services/interventionClientService";

const EditInterventionScreen = ({ route, navigation }) => {
  const { intervention } = route.params;

  const [form, setForm] = useState({
    ...intervention,
    scheduled_date: new Date(intervention.scheduled_date),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.client || !form.address || !form.scheduled_date || !form.status) {
      Alert.alert(
        "Erreur",
        "Tous les champs obligatoires doivent être remplis."
      );
      return;
    }

    try {
      setLoading(true);

      const id =
        typeof form.id === "object" && form.id !== null ? form.id.id : form.id;

      const scheduledDate =
        form.scheduled_date instanceof Date
          ? form.scheduled_date
          : new Date(form.scheduled_date);

      const payload = {
        id,
        client: form.client,
        address: form.address,
        issue: form.issue || "",
        scheduled_date: scheduledDate
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        status: form.status,
      };

      console.log("[EditInterventionScreen] Payload envoyé :", payload);

      await updateIntervention(payload);
      Alert.alert("Succès", "Intervention mise à jour.");
      navigation.goBack();
    } catch (error) {
      console.error("[EditInterventionScreen] Erreur update:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour cette intervention.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette intervention ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const id =
                typeof form.id === "object" && form.id !== null
                  ? form.id.id
                  : form.id;

              console.log(
                "[EditInterventionScreen] Tentative de suppression de l'intervention avec ID:",
                id
              );

              await deleteIntervention(id);
              Alert.alert("Succès", "Intervention supprimée avec succès.");
              navigation.goBack();
            } catch (error) {
              console.error(
                "[EditInterventionScreen] Erreur suppression:",
                error
              );
              Alert.alert(
                "Erreur",
                "Impossible de supprimer cette intervention: " + error.message
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header avec flèche retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'intervention</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Client</Text>
        <TextInput
          style={styles.input}
          value={form.client}
          onChangeText={(val) => handleChange("client", val)}
        />

        <Text style={styles.label}>Adresse</Text>
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

        <Text style={styles.label}>Date d’intervention</Text>
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
            onValueChange={(val) => handleChange("status", val)}
          >
            <Picker.Item label="Prévu" value="scheduled" />
            <Picker.Item label="En cours" value="in_progress" />
            <Picker.Item label="Terminé" value="completed" />
            <Picker.Item label="Annulé" value="cancelled" />
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator color="#1F2631" />
        ) : (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveText}>Enregistrer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
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
  saveButton: {
    backgroundColor: "#1F2631",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#d11a2a",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditInterventionScreen;
