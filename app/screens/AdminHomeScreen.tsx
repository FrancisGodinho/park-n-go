import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth, db } from "../utils/Firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import ParkingAPI from "../api/ParkingAPI";
import Headers from "../constants/Headers";
import Colors from "../constants/Colors";
import { useGlobalContext } from "../utils/context";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import MapView, { Marker } from "react-native-maps";

const LOT_ID = "jw7d1mNE2Cw1mTG0tzzH";
type Props = {};

// const lotSchema = Yup.object().shape({
//   rate: Yup.number()
//     .required()
//     .test("something", "LOL", (value: number) => {
//       console.log("value: " + value);
//       return value > 0;
//     }),
// });

const AdminHomeScreen = (props: Props) => {
  const [lotRate, setLotRate] = useState("");
  const [lotCapacity, setLotCapacity] = useState("");
  const [curNumCars, setCurNumCars] = useState(0);
  const [lotLongitude, setLotLongitude] = useState("");
  const [lotLatitude, setLotLatitude] = useState("");
  const [lotCoordinate, setLotCoordinate] = useState({
    coordinate: { longitude: 0, latitude: 0 },
  });
  const [lotDescription, setLotDescription] = useState("");

  // Note that lotId is null because the admin was not associated with any parking lot during registration
  // In reality an admin should contact us to set up the parkade for security reasons
  // Currently using a fixed LOT_ID for this admin
  const { lotName, lotId, setLotName } = useGlobalContext();

  const formik = useFormik({
    initialValues: {
      rate: lotRate,
      capacity: lotCapacity,
      longitude: lotLongitude,
      latitude: lotLatitude,
    },
    enableReinitialize: true,
    // validationSchema: lotSchema,
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
      setLotCoordinate({
        coordinate: {
          longitude: parseFloat(lotSnap.data()?.longitude),
          latitude: parseFloat(lotSnap.data()?.latitude),
        },
      });
      setLotDescription(`Rate: $${lotSnap.data()?.rate} per hour`);
    })();
  }, [LOT_ID]);

  const signOut = () => {
    auth.signOut();
  };

  const updateRate = (newRate: string) => {
    setLotRate(newRate);
    (async () => {
      await updateDoc(
        doc(db, "lots", LOT_ID),
        "rate",
        parseFloat(formik.values.rate)
      );
    })();
  };

  const updateCapacity = (newCapacity: string) => {
    setLotCapacity(newCapacity);
    (async () => {
      await updateDoc(
        doc(db, "lots", LOT_ID),
        "capacity",
        parseFloat(formik.values.capacity)
      );
    })();
  };

  const updateLongitude = (newLongitude: string) => {
    setLotLongitude(newLongitude);
    (async () => {
      await updateDoc(
        doc(db, "lots", LOT_ID),
        "longitude",
        parseFloat(formik.values.longitude)
      );
    })();
  };

  const updateLatitude = (newLatitude: string) => {
    setLotLatitude(newLatitude);
    (async () => {
      await updateDoc(
        doc(db, "lots", LOT_ID),
        "latitude",
        parseFloat(formik.values.latitude)
      );
    })();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView testID="admin-safe-view" style={styles.pageContainer}>
        <Text style={[Headers.h1, styles.h1]}>{lotName}</Text>
        <View style={styles.pageContainer}>
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemText} testID="rate-text">
                {"Rate: "}
              </Text>
              <Text style={[Headers.h2, styles.itemTextBody]}>
                ${lotRate}/hr
              </Text>
            </View>
            <CustomTextInput
              formik={formik}
              name="rate"
              style={styles.customInput}
              placeholder={""}
              value={formik.values.rate}
              onSubmitEditing={() => {
                updateRate(formik.values.rate);
              }}
            />
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemText} testID="capacity-text">
                {"Capacity: "}
              </Text>
              <Text style={[Headers.h2, styles.itemTextBody]}>
                {curNumCars}/{lotCapacity}
              </Text>
            </View>
            <CustomTextInput
              formik={formik}
              name="capacity"
              style={styles.customInput}
              placeholder={""}
              value={formik.values.capacity}
              onSubmitEditing={() => {
                updateCapacity(formik.values.capacity);
              }}
            />
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemText} testID="longitude-text">
                {"Longitude: "}
              </Text>
              <Text style={[Headers.h2, styles.itemTextBody]}>
                {lotLongitude}
              </Text>
            </View>
            <CustomTextInput
              formik={formik}
              name="longitude"
              style={styles.customInput}
              placeholder={""}
              value={formik.values.longitude}
              onSubmitEditing={() => {
                updateLongitude(formik.values.longitude);
              }}
            />
          </View>
          <View style={{ marginBottom: 10, ...styles.itemContainer }}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemText} testID="latitude-text">
                {"Latitude: "}
              </Text>
              <Text style={[Headers.h2, styles.itemTextBody]}>
                {lotLatitude}
              </Text>
            </View>
            <CustomTextInput
              editable
              formik={formik}
              name="latitude"
              style={styles.customInput}
              placeholder={""}
              value={formik.values.latitude}
              onSubmitEditing={() => {
                updateLatitude(formik.values.latitude);
              }}
            />
          </View>
          <MapView style={styles.mapView} showsUserLocation>
            <Marker
              coordinate={lotCoordinate.coordinate}
              title={lotName}
              description={lotDescription}
            />
          </MapView>
          <CustomButton disabled={false} text="Sign Out" onPress={signOut} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: Colors.black,
  },
  h1: { marginTop: 10 },
  itemContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  itemTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  itemTextBody: { color: Colors.primary },
  customInput: {
    maxWidth: "90%",
    maxHeight: 15,
  },
  signOutButton: {
    maxWidth: "30%",
  },
  mapView: {
    height: "40%",
  },
});
