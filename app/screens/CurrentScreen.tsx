import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/context";
import Headers from "../constants/Headers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
import Colors from "../constants/Colors";
import ParkadeFinder from "../components/ParkadeFinder";

type Props = {};

const CurrentScreen = (props: Props) => {
  const { isParking, startTime, lotId } = useGlobalContext();

  const [parkingTime, setParkingTime] = useState(0);
  const [counter, setCounter] = useState<NodeJS.Timer>();
  const [lotName, setLotName] = useState();
  const [lotRate, setLotRate] = useState(0);

  useEffect(() => {
    if (lotId)
      (async () => {
        const lotSnap = await getDoc(doc(db, "lots", lotId));
        setLotName(lotSnap.data()?.name);
        setLotRate(lotSnap.data()?.rate);
      })();
  }, [lotId]);

  useEffect(() => {
    if (isParking && startTime) {
      console.log("hi", isParking, startTime);

      const interval = setInterval(() => {
        setParkingTime(
          Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        );
      }, 1000);
      setCounter(interval);
    } else if (counter) {
      console.log("yello");
      clearInterval(counter);
    }
    return () => clearInterval(counter);
  }, [isParking, startTime]);

  return (
    <SafeAreaView style={styles.container} testID="screen-view">
      {!isParking ? (
        <ParkadeFinder />
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={[Headers.h1, styles.lotName]}>{lotName}</Text>
          <View style={styles.startTime}>
            <Text style={[Headers.h2, { color: Colors.darkWhite }]}>
              Started:{" "}
            </Text>
            <Text style={[Headers.h2, { color: Colors.primary }]}>
              {startTime?.toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.main}>
            <Text style={styles.time}>
              {Math.floor(parkingTime / 3600)}:
              {Math.floor((parkingTime % 3600) / 60)
                .toString()
                .padStart(2, "0")}
              :{(parkingTime % 60).toString().padStart(2, "0")}
            </Text>
            <View style={styles.money}>
              <Text style={[Headers.h2, styles.moneyText]}>
                ${lotRate * Math.floor(parkingTime / 3600)}
              </Text>
              <Text style={[Headers.h2, styles.moneyText]}>${lotRate}/hr</Text>
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
  time: { fontSize: 50, fontWeight: "600", color: Colors.white },
  money: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moneyText: { color: Colors.lightGray },
});
