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

type Props = {};
const LOT_ID = "jw7d1mNE2Cw1mTG0tzzH";

const AdminHomeScreen = (props: Props) => {
  const [lotRate, setLotRate] = useState(0);
  const [lotCapacity, setLotCapacity] = useState(0);
  const [curNumCars, setCurNumCars] = useState(0);
  const [lotLongitude, setLotLongitude] = useState(0);
  const [lotLatitude, setLotLatitude] = useState(0);

  // Note that lotId is null because the admin is not associated with any parking lot
  // Currently using a fixed LOT_ID for this admin
  const { lotName, lotId, setLotName } = useGlobalContext();

  const formik = useFormik({
    initialValues: {
      longitude: lotLongitude,
      latitude: lotLatitude,
    },
    enableReinitialize: true,
    // validationSchema: ProfileSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    (async () => {
      const lotSnap = await getDoc(doc(db, "lots", LOT_ID));
      setLotName(lotSnap.data()?.name);
      setLotRate(lotSnap.data()?.rate);
      setLotCapacity(lotSnap.data()?.capacity);
      setCurNumCars(lotSnap.data()?.currentNumCars);
      setLotLongitude(lotSnap.data()?.longitude);
      setLotLatitude(lotSnap.data()?.latitude);

      console.log("lot rate is: " + lotSnap.data()?.rate);
      console.log("lot capacity is: " + lotSnap.data()?.capacity);
    })();
  }, [LOT_ID]);

  const signOut = () => {
    auth.signOut();
  };

  // Have to increment twice initially to update the rate or capacity in database?
  // TODO: actually set rate! change it to user input instead of incrementing
  const updateRate = (newRate: number) => {
    console.log("Setting rate!!");
    setLotRate(lotRate + 1);
    (async () => {
      console.log("Updateing rate in database");
      await updateDoc(doc(db, "lots", LOT_ID), "rate", lotRate);
    })();
  };
  // TODO: actually set capacity! change it to user input instead of incrementing
  const updateCapacity = (newCapacity: number) => {
    console.log("Setting capacity!!");
    setLotCapacity(lotCapacity + 1);
    (async () => {
      console.log("Updateing capacity in database");
      await updateDoc(doc(db, "lots", LOT_ID), "capacity", lotCapacity);
    })();
  };

  // Problem: have to enter twice to set any value
  // Also, the CustomTextInput field is invisible
  const updateLongitude = (newLongitude: number) => {
    console.log("Setting longitude!!");
    setLotLongitude(newLongitude);
    (async () => {
      console.log("Updateing longitude in database");
      await updateDoc(doc(db, "lots", LOT_ID), "longitude", lotLongitude);
    })();
  };

  const updateLatitude = (newLatitude: number) => {
    console.log("Setting latitude!!");
    setLotLatitude(newLatitude);
    (async () => {
      console.log("Updateing latitude in database");
      await updateDoc(doc(db, "lots", LOT_ID), "latitude", lotLatitude);
    })();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[Headers.h1, styles.h1]}>{lotName}</Text>
      <View style={styles.container}>
        <View style={styles.rate}>
          <Text style={styles.itemText}>{"Rate:"}</Text>
          <Text style={[Headers.h2, styles.itemTextBody]}>${lotRate}/hr</Text>
          <CustomButton disabled={false} text="set rate" onPress={updateRate} />
        </View>
        <View style={styles.capacity}>
          <Text style={styles.itemText}>{"Capacity:"}</Text>
          <Text style={[Headers.h2, styles.itemTextBody]}>
            {curNumCars}/{lotCapacity}
          </Text>
          <CustomButton
            disabled={false}
            text="set capacity"
            onPress={updateCapacity}
          />
        </View>
        <View style={styles.longitude}>
          <Text style={styles.itemText}>{"Longitude:"}</Text>
          <Text style={[Headers.h2, styles.itemTextBody]}>{lotLongitude}</Text>
          {/* <CustomTextInput
            formik={formik}
            name="longitude"
            placeholder={lotLongitude.toString()}
            value={formik.values.longitude}
            onSubmitEditing={() => {
              updateLongitude(formik.values.longitude);
            }}
          /> */}
        </View>
        <View style={styles.latitude}>
          <Text style={styles.itemText}>{"Latitude:"}</Text>
          <Text style={[Headers.h2, styles.itemTextBody]}>{lotLatitude}</Text>
          {/* <CustomTextInput
            formik={formik}
            name="latitude"
            placeholder="latitude"
            value={formik.values.latitude}
            onSubmitEditing={() => {
              updateLatitude(formik.values.latitude);
            }}
          /> */}
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
  itemText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  itemTextBody: { color: Colors.lightGray },
  rate: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  capacity: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "5%",
  },
  longitude: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "5%",
  },
  latitude: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "5%",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
