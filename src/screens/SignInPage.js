import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import ButtonCeleris from "../utils/ButtonCeleris";
import { loginUser } from "../services/authClientService";

const SignInPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      navigation.navigate("Dashboard");
    } catch (error) {
      Alert.alert("Erreur de connexion", error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1F2631" style={styles.loader} />
      ) : (
        <ButtonCeleris
          title="CONNEXION"
          onPress={handleSignIn}
          backgroundColor="#1F2631"
          Color="#fff"
          BorderColor="#fff"
        />
      )}

      <Text
        style={styles.forgotPassword}
        onPress={() => console.log("Mot de passe oublié")}
      >
        Mot de passe oublié ?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2631",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  forgotPassword: {
    color: "#1F2631",
    textAlign: "center",
    marginTop: 16,
    textDecorationLine: "underline",
  },
  testButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
    alignItems: "center",
  },
  testButtonText: {
    color: "#1F2631",
    fontWeight: "bold",
  },
});

export default SignInPage;
