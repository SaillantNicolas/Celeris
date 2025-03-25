import React, { useRef, useState } from 'react';
import { Platform, View, Button, StyleSheet, Text } from 'react-native';
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

  const handleSignature = (signature) => {
    setSigned(true);
    console.log("Signature récupérée");
    onOK(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
    setSigned(false);
  };

  return (
    <View style={styles.container}>
      <Signature
        ref={ref}
        onOK={handleSignature}
        descriptionText="Signature"
        clearText="Effacer"
        confirmText="Confirmer"
        webStyle={`.m-signature-pad { border: none; }`}
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