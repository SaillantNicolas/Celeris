import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ButtonCeleris from '../utils/ButtonCeleris';

const SignInPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Tentative de connexion avec:', email);
    // Temporaire faut remettre Home après !!!
    navigation.navigate('Dashboard');
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
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ButtonCeleris
        title="CONNEXION"
        onPress={handleSignIn}
        backgroundColor="#1F2631"
        Color="#fff"
        BorderColor="#fff"
      />
      <Text 
        style={styles.forgotPassword}
        onPress={() => console.log('Mot de passe oublié')}
      >
        Mot de passe oublié ?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2631',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  forgotPassword: {
    color: '#1F2631',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});

export default SignInPage;