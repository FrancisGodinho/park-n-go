import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Headers from "../constants/Headers";
import Colors from "../constants/Colors";

interface Props {
  toScreen: string;
}

type StackParamList = {
  Splash: undefined;
  UserRegister: undefined;
  AdminRegister: undefined;
  Login: undefined;
};

const AuthRedirect = ({ toScreen }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={[Headers.p, styles.text1]}>
        {toScreen === "Login" ? "Already" : "Don't"} have an account?{" "}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate(toScreen)}>
        <Text style={[Headers.p, styles.text2]}>{toScreen}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthRedirect;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  text1: {
    fontSize: 15,
  },
  text2: {
    color: Colors.primary,
    fontSize: 15,
  },
});
