import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ButtonCeleris from '../utils/ButtonCeleris';

const SignUpPage = () => {
    const [form, setForm] = useState({
        name: '',
        firstname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        companyName: ''
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        console.log(form);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer un compte</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom"
                onChangeText={(value) => handleChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Prénom"
                onChangeText={(value) => handleChange('firstname', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={(value) => handleChange('email', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                onChangeText={(value) => handleChange('password', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                secureTextEntry
                onChangeText={(value) => handleChange('confirmPassword', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Numéro de téléphone"
                keyboardType="phone-pad"
                onChangeText={(value) => handleChange('phoneNumber', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Nom de l'entreprise"
                onChangeText={(value) => handleChange('companyName', value)}
            />
            <ButtonCeleris
              title="Création du compte"
              onPress={() => handleSubmit()}
              backgroundColor="#1F2631"
              Color="#fff"
              BorderColor="#fff"
            />
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
    },
});

export default SignUpPage;