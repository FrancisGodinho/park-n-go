import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import Headers from "../constants/Headers";
import Colors from "../constants/Colors";

interface Props {
  disabled: boolean;
  style: object | null;
  text: string;
  onPress: any;
}

const CustomButton = ({ disabled, style, text, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[Headers.p, styles.text]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    marginTop: "auto",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  text: { textAlign: "center", color: "white" },
});
