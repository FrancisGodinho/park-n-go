import { SafeAreaView, StyleSheet, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/Firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useGlobalContext } from "../utils/context";
import { useFormik } from "formik";
import * as Yup from "yup";

import CustomButton from "../components/CustomButton";
import CustomHeader from "../components/CustomHeader";
import CustomTextInput from "../components/CustomTextInput";

type Props = {};

const ProfileSchema = Yup.object().shape({
  plate: Yup.string().required("Required"),
  creditCard: Yup.string().min(6, "Must be 16 digits").required("Required")
});

const ProfileScreen = (props: Props) => {
  const userEmail: string = `${auth.currentUser?.email}`; 
  const userID: string = `${auth.currentUser?.uid}`;
  const { licensePlate } = useGlobalContext();

  const [creditCard, setCreditCard] = useState<string>("");

  useEffect(() => {
    (async () => {
      const userSnap = await getDoc(doc(db, "users", userID));
      setCreditCard(userSnap.data()?.creditCard);
    })();  
  }, []);

  const formik = useFormik({
    initialValues: {
      plate: licensePlate,
      creditCard: creditCard, // TODO: init this to value from database
    },
    validationSchema: ProfileSchema,
    onSubmit: (values) => {
      console.log(values); 
    },
  });
  
  const signOut = () => {
    console.log("User signout");
    auth.signOut();
  };

  const updatePlate = (plate: string) => {
    (async () => {
      await updateDoc(doc(db, "users", userID), "licensePlate", plate);
    })();
  }
  
  const updateCreditCard = (creditCard: string) => {
    (async () => {
      console.log("hello");
      await updateDoc(doc(db, "users", userID), "creditCard", creditCard);
    })();
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader backDisabled={true} text={ userEmail } />
      <CustomTextInput
        formik={formik}
        icon="car"
        name="plate" 
        placeholder="License Plate"
        value={formik.values.plate}
        onSubmitEditing={ updatePlate(formik.values.plate) }
      />
      <CustomTextInput
        formik={formik}
        isPass
        icon="credit-card"
        name="creditCard" 
        placeholder="Credit Card"
        value={formik.values.creditCard}
        onSubmitEditing={ updateCreditCard(formik.values.creditCard) }
      />
      <CustomButton disabled={false} text="Sign Out" onPress={signOut}/>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 10 },
});
