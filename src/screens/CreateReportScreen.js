import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImageUploader from "../components/ImageUploader";
import SignaturePad from "../components/SignaturePad";
import ButtonCeleris from "../utils/ButtonCeleris";
import AIImageAnalyzer from "../components/AIImageAnalyzer";
import {
  reformulateTextWithGPT,
  analyzeProblemImagesWithGPT,
  analyzeActionImagesWithGPT,
} from "../services/openaiService";
import { getCurrentUser } from "../services/authClientService";
import { createReport } from "../services/reportClientService";
import * as FileSystem from "expo-file-system";

const CreateReportScreen = ({ navigation, route }) => {
  const intervention = route.params?.intervention || {};

  const [form, setForm] = useState({
    clientName: intervention.client || "",
    interventionDate: new Date().toISOString().slice(0, 10),
    address: intervention.address || "",
    issue: intervention.issue || "",
    description: "",
    actions: "",
    materials: "",
  });

  const [images, setImages] = useState([]);
  const [reformulating, setReformulating] = useState(false);
  const [signature, setSignature] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleProblemAnalysis = (analysisText) => {
    handleChange("description", analysisText);
  };

  const handleActionAnalysis = (analysisText) => {
    handleChange("actions", analysisText);
  };

  const handleImagesSelected = (selectedImages) => {
    setImages([...images, ...selectedImages]);
  };

  const handleReformulate = async (field) => {
    if (!form[field] || form[field].trim() === "") {
      alert(`Veuillez d'abord saisir du texte dans le champ.`);
      return;
    }

    setReformulating(true);
    try {
      const reformulatedText = await reformulateTextWithGPT(form[field]);
      handleChange(field, reformulatedText);
    } catch (error) {
      console.error("Erreur lors de la reformulation:", error);
      alert("Une erreur est survenue lors de la reformulation du texte.");
    } finally {
      setReformulating(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.clientName || !form.interventionDate || !form.address) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSubmitting(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("Vous devez être connecté.");

      const base64Images = await Promise.all(
        images.map(async (uri) => {
          if (uri.startsWith("file://")) {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: "base64",
            });
            return `data:image/jpeg;base64,${base64}`;
          }
          return uri;
        })
      );

      const reportData = {
        interventionId: intervention.id,
        clientName: form.clientName,
        interventionDate: form.interventionDate,
        address: form.address,
        issue: form.issue,
        description: form.description,
        actions: form.actions,
        materials: form.materials,
        images: base64Images,
        signature,
      };

      console.log("Envoi du rapport:", reportData);
      const result = await createReport(reportData);
      console.log("Rapport créé avec succès:", result);

      alert("Rapport créé avec succès !");
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la création du rapport:", error);
      alert("Une erreur est survenue : " + error.toString());
    } finally {
      setSubmitting(false);
    }
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
          onChangeText={(value) => handleChange("clientName", value)}
          placeholder="Nom du client"
        />

        <Text style={styles.label}>Date d'intervention:</Text>
        <TextInput
          style={styles.input}
          value={form.interventionDate}
          onChangeText={(value) => handleChange("interventionDate", value)}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Adresse:</Text>
        <TextInput
          style={styles.input}
          value={form.address}
          onChangeText={(value) => handleChange("address", value)}
          placeholder="Adresse complète"
        />

        <Text style={styles.sectionTitle}>Détails de l'intervention</Text>

        <Text style={styles.label}>Description du problème constaté:</Text>
        <View style={styles.descriptionContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(value) => handleChange("description", value)}
            placeholder="Description du problème"
            multiline
            numberOfLines={4}
          />
          <View style={styles.aiTools}>
            <AIImageAnalyzer
              onAnalysisComplete={handleProblemAnalysis}
              onImagesSelected={handleImagesSelected}
              analyzeFunction={analyzeProblemImagesWithGPT}
              buttonText="Analyser le problème"
              modalTitle="Analyser les images du problème ?"
            />

            <TouchableOpacity
              style={styles.reformulateButton}
              onPress={() => handleReformulate("description")}
              disabled={reformulating}
            >
              {reformulating ? (
                <ActivityIndicator size="small" color="#1F2631" />
              ) : (
                <>
                  <Ionicons name="refresh" size={20} color="#1F2631" />
                  <Text style={styles.buttonText}>Reformuler</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Actions effectuées:</Text>
        <View style={styles.actionsContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.actions}
            onChangeText={(value) => handleChange("actions", value)}
            placeholder="Actions réalisées"
            multiline
            numberOfLines={4}
          />
          <View style={styles.aiTools}>
            <AIImageAnalyzer
              onAnalysisComplete={handleActionAnalysis}
              onImagesSelected={handleImagesSelected}
              analyzeFunction={analyzeActionImagesWithGPT}
              buttonText="Analyser les réparations"
              modalTitle="Analyser les images des réparations ?"
            />

            <TouchableOpacity
              style={styles.reformulateButton}
              onPress={() => handleReformulate("actions")}
              disabled={reformulating}
            >
              {reformulating ? (
                <ActivityIndicator size="small" color="#1F2631" />
              ) : (
                <>
                  <Ionicons name="refresh" size={20} color="#1F2631" />
                  <Text style={styles.buttonText}>Reformuler</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Matériels utilisés:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.materials}
          onChangeText={(value) => handleChange("materials", value)}
          placeholder="Liste des pièces"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Photos</Text>
        <ImageUploader images={images} setImages={setImages} />

        <Text style={styles.sectionTitle}>Signature</Text>
        <SignaturePad
          onSignature={(sig) => {
            console.log(
              "[CreateReportScreen] Signature reçue depuis le pad ✅"
            );
            setSignature(sig);
          }}
        />

        {signature && (
          <Image
            source={{ uri: signature }}
            style={{
              width: 200,
              height: 100,
              borderWidth: 1,
              borderColor: "#000",
              marginTop: 10,
            }}
          />
        )}

        <View style={styles.buttonContainer}>
          {submitting ? (
            <ActivityIndicator size="large" color="#1F2631" />
          ) : (
            <ButtonCeleris
              title="ENREGISTRER"
              onPress={handleSubmit}
              backgroundColor="#1F2631"
              Color="#fff"
              BorderColor="#fff"
            />
          )}
        </View>
      </ScrollView>
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
  content: { flex: 1, padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#1F2631",
  },
  label: { fontSize: 14, marginTop: 10, marginBottom: 5, color: "#555" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  descriptionContainer: { marginBottom: 15 },
  actionsContainer: { marginBottom: 15 },
  aiTools: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  reformulateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: { marginLeft: 5, color: "#1F2631" },
  buttonContainer: { marginVertical: 20 },
});

export default CreateReportScreen;
