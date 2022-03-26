import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFormik } from "formik";
import { auth } from "../utils/Firebase";
import ParkingAPI from "../api/ParkingAPI";
import CustomButton from "../components/CustomButton";

type Props = {};

const AdminHomeScreen = (props: Props) => {
  // TODO: Actually sign out
  const signOut = () => {
    console.log("signing out: TESTING!!!");
  };
  return (
    <SafeAreaView>
      <View>
        {/* <Text style={styles.titleText} /> */}
        <Text>{"Admin home screen"}</Text>
        <Text>{"UBC Thunderbird Parkade"}</Text>

        <Text>{"Rate"}</Text>
        <Text>{"Capacity"}</Text>
        <CustomButton disabled={false} text="Sign Out" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
