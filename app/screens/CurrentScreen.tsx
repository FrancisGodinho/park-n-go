import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/context";
import Headers from "../constants/Headers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
import Colors from "../constants/Colors";

type Props = {};

const CurrentScreen = (props: Props) => {
  const [parkingTime, setParkingTime] = useState(0);
  const [counter, setCounter] = useState<NodeJS.Timer>();
  const [lotName, setLotName] = useState();
  const [lotRate, setLotRate] = useState(0);

  const { isParking, startTime, lotId } = useGlobalContext();

  useEffect(() => {
    if (lotId)
      (async () => {
        const lotSnap = await getDoc(doc(db, "lots", lotId));
        console.log(lotSnap.data());
        setLotName(lotSnap.data()?.name);
        setLotRate(lotSnap.data()?.rate);
      })();
  }, [lotId]);

  useEffect(() => {
    console.log("yello");

    if (isParking) {
      const interval = setInterval(() => {
        setParkingTime((parkingTime) => parkingTime + 1);
      }, 1000);
      setCounter(interval);
    } else if (counter) {
      clearInterval(counter);
    }
    return clearInterval(counter);
  }, [isParking]);

  return (
    <SafeAreaView style={styles.container}>
      {!isParking ? (
        <Text style={Headers.h1}>No Parking</Text>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={[Headers.h1, styles.lotName]}>{lotName}</Text>
          <View style={styles.startTime}>
            <Text style={[Headers.h2, { color: Colors.darkWhite }]}>
              Started:{" "}
            </Text>
            <Text style={[Headers.h2, { color: Colors.primary }]}>
              {startTime.toDate().toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.main}>
            <Text style={styles.time}>{parkingTime}</Text>
            <View style={styles.money}>
              <Text>{lotRate * parkingTime}</Text>
              <Text>${lotRate}/hr</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CurrentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 10 },
  lotName: { textAlign: "left", marginTop: 10 },
  startTime: { flexDirection: "row" },
  main: { flex: 1, justifyContent: "center", alignItems: "center" },
  time: { fontSize: 40, color: Colors.white },
  money: { flexDirection: "row", justifyContent: "space-between" },
});
