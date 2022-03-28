import { SafeAreaView, StyleSheet, Text } from "react-native";
import React from "react";
import { auth, db } from "../utils/Firebase";
import { useGlobalContext } from "../utils/context";
import { useFormik } from "formik";
import * as Yup from "yup";

import CustomButton from "../components/CustomButton";
import CustomHeader from "../components/CustomHeader";
import CustomTextInput from "../components/CustomTextInput";

type Props = {};

const ProfileSchema = Yup.object().shape({
  plate: Yup.string().required("Required"),
  creditCard: Yup.string().required("Required")
});

const ProfileScreen = (props: Props) => {
  const userEmail: string = `${auth.currentUser?.email}`; 
  const { licensePlate } = useGlobalContext();

  const formik = useFormik({
    initialValues: {
      plate: licensePlate,
      creditCard: "",
    },
    validationSchema: ProfileSchema,
    onSubmit: (values) => {
      console.log(values); // TODO: update the values in user profile in db?
    },
  });
  
  const signOut = () => {
    console.log("User signout");
    auth.signOut();
  };

  return (
    //TODO: get credit card number, update the values in user profile
    <SafeAreaView style={styles.container}>
      <CustomHeader backDisabled={true} text={ userEmail } />
      <CustomTextInput
        formik={formik}
        icon="car"
        name="plate" 
        placeholder="License Plate"
        value={formik.values.plate}
        onSubmitEditing={() => {}}
      />
      <CustomTextInput
        formik={formik}
        isPass
        icon="credit-card"
        name="creditCard" 
        placeholder="Credit Card"
        value={formik.values.creditCard}
        onSubmitEditing={() => {}}
      />
      <CustomButton disabled={false} text="Sign Out" onPress={signOut}/>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 10 },
});
