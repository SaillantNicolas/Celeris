import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import ButtonCeleris from "../utils/ButtonCeleris";
import { ImagesAssets } from "../../assets/ImageAssets";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={ImagesAssets.CelerisLogo}
        style={[styles.backgroundImage, { height: "75%" }]}
        resizeMode="contain"
      >
        <View style={styles.buttonContainer}>
          <ButtonCeleris
            title="SE CONNECTER"
            onPress={() => navigation.navigate("SignIn")}
            backgroundColor="#fff"
            Color="#1F2631"
            BorderColor="#1F2631"
          />
          <ButtonCeleris
            title="CRÉER UN COMPTE"
            onPress={() => navigation.navigate("SignUp")}
            backgroundColor="#1F2631"
            Color="#fff"
            BorderColor="#fff"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2631",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    padding: 20,
    flexDirection: "column",
    gap: 10,
  },
});

export default HomeScreen;
