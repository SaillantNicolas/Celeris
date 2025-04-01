import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ButtonCeleris = ({
  title,
  onPress,
  backgroundColor,
  Color = "transparent",
  BorderColor = "#000",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor: BorderColor }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: Color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonCeleris;
