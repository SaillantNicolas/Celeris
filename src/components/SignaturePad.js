import React, { useRef, useState } from 'react';
import { Platform, View, Button, StyleSheet, Text, Alert } from 'react-native';
import Signature from 'react-native-signature-canvas';

const SignaturePad = ({ onOK }) => {
  const ref = useRef();
  const [signed, setSigned] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text>La signature n'est pas disponible sur le Web pour le moment.</Text>
      </View>
    );
  }

  // Cette fonction est modifiée pour s'assurer que la signature est correctement traitée
  const handleSignature = (signature) => {
    setSigned(true);
    
    // S'assurer que la signature commence par "data:"
    if (signature && !signature.startsWith('data:')) {
      signature = 'data:image/png;base64,' + signature;
    }
    
    // Alerter l'utilisateur que la signature a été capturée
    Alert.alert("Signature capturée", "La signature a été enregistrée.");
    
    // Appeler le callback avec la signature
    if (typeof onOK === 'function') {
      onOK(signature);
    }
  };

  const handleClear = () => {
    ref.current.clearSignature();
    setSigned(false);
  };

  // Style spécifique pour s'assurer que le composant fonctionne correctement
  const style = `.m-signature-pad {box-shadow: none; border: none; } 
                .m-signature-pad--body {border: none;}
                .m-signature-pad--footer {display: none; margin: 0px;}
                body,html {
                  height: 100%;
                  width: 100%;
                }`;

  return (
    <View style={styles.container}>
      <Signature
        ref={ref}
        onOK={handleSignature}
        descriptionText="Signature"
        clearText="Effacer"
        confirmText="Confirmer"
        webStyle={style}
        backgroundColor="white"
        penColor="black"
        minWidth={2}
        maxWidth={3}
        trimWhitespace={true}
        imageType="image/png"
      />
      <View style={styles.controls}>
        <Button title="Effacer" onPress={handleClear} />
        {signed && <Text style={styles.signedText}>Signature enregistrée ✓</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  signedText: {
    color: 'green',
    fontWeight: 'bold',
  }
});

export default SignaturePad;