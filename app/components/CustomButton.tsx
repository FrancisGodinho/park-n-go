import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import Headers from "../constants/Headers";
import Colors from "../constants/Colors";

interface Props {
  disabled: boolean;
  text: string;
  onPress: any;
}

const CustomButton = ({ disabled, text, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[Headers.p, styles.text, disabled && styles.disabledText]}>
        {text}
      </Text>
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
  disabled: { backgroundColor: Colors.lightBlack },
  text: { textAlign: "center", color: Colors.white },
  disabledText: { color: Colors.darkWhite },
});
