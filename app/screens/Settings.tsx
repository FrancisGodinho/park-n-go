import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { signOut } from "@firebase/auth";
import { auth } from "../utils/Firebase";

type Props = {};

const Settings = (props: Props) => {
  const handleSignOut = () => {
    signOut(auth).catch((err) => console.error(err));
  };

  handleSignOut();

  return (
    <View>
      <Text>Settings</Text>
      <TouchableOpacity onPress={handleSignOut}></TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
