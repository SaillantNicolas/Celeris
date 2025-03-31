import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import ButtonCeleris from '../utils/ButtonCeleris';
import { registerUser } from '../services/authClientService';

const SignUpPage = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        firstname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        companyName: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        // Validation basique
        if (!form.email || !form.password || !form.name || !form.firstname) {
            console.log("manque des champs");
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (form.password !== form.confirmPassword) {
            console.log("mdp pas identique");
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        if (form.password.length < 8) {
            console.log("mdp trop courts");
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setLoading(true);
        try {
            // Préparer les données à envoyer en s'assurant que les champs ont les bons noms
            const userData = {
                name: form.name,
                firstname: form.firstname,
                email: form.email,
                password: form.password,
                phoneNumber: form.phoneNumber || '', // Assurer qu'une valeur est toujours envoyée même vide
                companyName: form.companyName || ''  // Assurer qu'une valeur est toujours envoyée même vide
            };

            console.log('Envoi des données d\'inscription:', userData);

            // Appeler le service d'inscription
            const result = await registerUser(userData);
            console.log('Inscription réussie:', result);
            
            Alert.alert(
                'Inscription réussie',
                'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
                [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
            );
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            
            // Message d'erreur plus précis
            let errorMessage = typeof error === 'string' 
                ? error 
                : 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
                
            Alert.alert('Erreur d\'inscription', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Créer un compte</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={form.name}
                    onChangeText={(value) => handleChange('name', value)}
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={form.firstname}
                    onChangeText={(value) => handleChange('firstname', value)}
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={form.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(value) => handleChange('email', value)}
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={form.password}
                    onChangeText={(value) => handleChange('password', value)}
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry
                    value={form.confirmPassword}
                    onChangeText={(value) => handleChange('confirmPassword', value)}
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Numéro de téléphone"
                    keyboardType="phone-pad"
                    value={form.phoneNumber}
                    onChangeText={(value) => handleChange('phoneNumber', value)}
                    editable={!loading}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nom de l'entreprise"
                    value={form.companyName}
                    onChangeText={(value) => handleChange('companyName', value)}
                    editable={!loading}
                />
                
                {loading ? (
                    <ActivityIndicator size="large" color="#1F2631" style={styles.loader} />
                ) : (
                    <ButtonCeleris
                        title="Création du compte"
                        onPress={handleSubmit}
                        backgroundColor="#1F2631"
                        Color="#fff"
                        BorderColor="#fff"
                    />
                )}
                
                <Text 
                    style={styles.loginText}
                    onPress={() => navigation.navigate('SignIn')}
                >
                    Déjà un compte ? Se connecter
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
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
    loader: {
        marginTop: 20,
    },
    loginText: {
        color: '#1F2631',
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
    }
});

export default SignUpPage;