import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { auth, db } from "../utils/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ParkingAPI from "../api/ParkingAPI";
import Headers from "../constants/Headers";
import Colors from "../constants/Colors";
import { useGlobalContext } from "../utils/context";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";

type Props = {
  lotName: string | undefined;
};

const AdminHomeScreen = (props: Props) => {
  // TODO: get initial lot rate and capacity?
  const [lotRate, setLotRate] = useState(0);
  const [lotCapacity, setLotCapacity] = useState(0);

  const { parkingHistory, lotName, lotId } = useGlobalContext();
  // useEffect(() => {
  //   if (lotId)
  //     async () => {
  //       const lotSnap = await getDoc(doc(db, "lots", lotId));
  //       setLotRate(lotSnap.data()?.rate);
  //     };
  // }, [lotId]);
  console.log("Lot name is: ");
  console.log(props.lotName);

  const signOut = () => {
    auth.signOut();
  };

  // TODO: actually set rate! change it to user input instead of incrementing
  const setRate = () => {
    console.log("setting rate!!");
    setLotRate(lotRate + 1);
    if (lotId)
      async () => {
        await updateDoc(doc(db, "lots", lotId), "rate", lotRate);
      };
  };
  // TODO: actually set capacity!
  const setCapacity = () => {
    console.log("setting capacity!!");
    setLotCapacity(lotCapacity + 1);

    console.log("Lot id is");
    console.log(lotId);
    if (lotId)
      async () => {
        await updateDoc(doc(db, "lots", lotId), "capacity", lotCapacity);
      };
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[Headers.h1, styles.h1]}>UBC Thunderbird Parkade</Text>
      {/* <Text style={[Headers.h1, styles.lotName]}>{props.lotName}</Text> */}
      <View style={styles.container}>
        <View style={styles.rate}>
          <Text style={styles.rateText}>{"Rate:"}</Text>
          <Text style={[Headers.h2, styles.moneyText]}>${lotRate}/hr</Text>
          <CustomButton disabled={false} text="set rate" onPress={setRate} />
        </View>
        <View style={styles.capacity}>
          <Text style={styles.capacityText}>{"Capacity:"}</Text>
          <Text style={[Headers.h2, styles.capacityTextBody]}>
            {lotCapacity}
          </Text>
          <CustomButton
            disabled={false}
            text="set capacity"
            onPress={setCapacity}
          />
        </View>
        <CustomButton disabled={false} text="Sign Out" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  h1: { marginTop: 20, marginBottom: 10 },
  lotName: { textAlign: "left", marginTop: 10 },
  rate: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moneyText: { color: Colors.lightGray },
  rateText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  capacity: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  capacityTextBody: { color: Colors.lightGray },
  capacityText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
