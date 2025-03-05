import React, { useRef } from 'react';
import { Platform, View, Button, StyleSheet, Text } from 'react-native';
import Signature from 'react-native-signature-canvas';

const SignaturePad = ({ onOK }) => {
  const ref = useRef();

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text>La signature n'est pas disponible sur le Web pour le moment.</Text>
      </View>
    );
  }

  const handleClear = () => {
    ref.current.clearSignature();
  };

  return (
    <View style={styles.container}>
      <Signature
        ref={ref}
        onOK={onOK}
        descriptionText="Signature"
        clearText="Effacer"
        confirmText="Confirmer"
        webStyle={`.m-signature-pad { border: none; }`}
      />
      <Button title="Effacer" onPress={handleClear} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    height: 300,
  },
});

export default SignaturePad;
