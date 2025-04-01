import React, { useRef } from "react";
import SignatureScreen from "react-native-signature-canvas";
import { View, StyleSheet, Button } from "react-native";

const SignaturePad = ({ onSignature }) => {
  const ref = useRef();

  const handleOK = (signature) => {
    console.log("[SignaturePad] Signature capturée ✅");
    if (
      signature &&
      typeof signature === "string" &&
      signature.startsWith("data:image")
    ) {
      onSignature(signature);
    } else {
      console.warn("[SignaturePad] Signature invalide ❌", signature);
    }
  };

  const handleEnd = () => {
    console.log("[SignaturePad] Fin de dessin ✍️");
    ref.current?.readSignature();
  };

  return (
    <View style={styles.container}>
      <SignatureScreen
        ref={ref}
        onOK={handleOK}
        onEnd={handleEnd}
        autoClear={false}
        imageType="image/png"
        descriptionText="Signez ici"
        clearText="Effacer"
        confirmText="Valider"
        webStyle={`
          .m-signature-pad {
            box-shadow: none; 
            border: 1px solid #ccc;
          }
          .m-signature-pad--footer {
            display: none;
          }
        `}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 16,
  },
});

export default SignaturePad;
