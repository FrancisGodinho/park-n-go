import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { auth, db } from "../utils/Firebase";
import { doc, getDoc } from "firebase/firestore";
import ParkingAPI from "../api/ParkingAPI";
import Headers from "../constants/Headers";
import Colors from "../constants/Colors";
import { useGlobalContext } from "../utils/context";
import CustomButton from "../components/CustomButton";

type Props = {
  lotName: string | undefined;
};

const AdminHomeScreen = (props: Props) => {
  // TODO; get actual lot name?
  const [lotRate, setLotRate] = useState(0);
  const [lotCapacity, setLotCapacity] = useState(0);

  const { parkingHistory, lotName, lotId } = useGlobalContext();
  useEffect(() => {
    if (lotId)
      async () => {
        const lotSnap = await getDoc(doc(db, "lots", lotId));
        setLotRate(lotSnap.data()?.rate);
      };
  }, [lotId]);

  const signOut = () => {
    console.log("signing out: TESTING!!!");
    console.log("Lot name is: ");
    console.log(props.lotName);
    auth.signOut();
  };

  // TODO: actually set rate!
  const setRate = () => {
    console.log("setting rate!!");
    setLotRate(lotRate + 1);
  };
  // TODO: actually set rate!
  const setCapacity = () => {
    console.log("setting capacity!!");
    setLotCapacity(lotCapacity + 1);
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
  baseText: {
    fontFamily: "Cochin",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
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
    // backgroundColor: "blue",
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  //   bottomCont: {
  //     flex: 1,
  //     paddingTop: 10,
  //     paddingHorizontal: 10,
  //     borderTopLeftRadius: 15,
  //     borderTopRightRadius: 15,
  //   },
});
