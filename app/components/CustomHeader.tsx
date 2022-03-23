import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Headers from "../constants/Headers";

interface Props {
  backDisabled: boolean;
  text: string;
}

const CustomHeader = ({ backDisabled, text }: Props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        disabled={backDisabled}
        onPress={navigation.goBack}
        style={{ flex: 1 }}
      >
        <FontAwesome5
          name="chevron-left"
          size={24}
          color={backDisabled ? Colors.black : "black"}
        />
      </TouchableOpacity>
      <Text style={[Headers.h1, { maxWidth: "90%" }]}>{text}</Text>
      <View style={{ flex: 1 }} />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
