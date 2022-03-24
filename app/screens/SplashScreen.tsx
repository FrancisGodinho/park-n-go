import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../constants/Colors";

type Props = {};

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <FontAwesome5 name="car" size={40} color={Colors.black} />
      </View>
      <Text>Parking Bot</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
});
