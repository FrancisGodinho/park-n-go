import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/context";
import Headers from "../constants/Headers";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";

type Props = {};

const CurrentScreen = (props: Props) => {
  const [parkingTime, setParkingTime] = useState(0);
  const [counter, setCounter] = useState<NodeJS.Timer>();
  const [lotName, setLotName] = useState();
  const [lotRate, setLotRate] = useState();

  const { isParking, startTime, lotId } = useGlobalContext();

  useEffect(() => {
    if (lotId)
      (async () => {
        const lotSnap = await getDoc(doc(db, "lots", lotId));
        setLotName(lotSnap.data()?.lotName);
        setLotRate(lotSnap.data()?.lotRate);
      })();
  }, [lotId]);

  useEffect(() => {
    if (isParking) {
      const interval = setInterval(() => setParkingTime(parkingTime + 1), 1000);
      setCounter(interval);
    } else if (counter) {
      clearInterval(counter);
    }
  }, [isParking]);

  return (
    <SafeAreaView>
      {!isParking ? (
        <Text style={Headers.h1}>No Parking</Text>
      ) : (
        <View>
          <Text style={Headers.h1}>{lotName}</Text>
          <View>
            <Text>Started: </Text>
            <Text>{startTime}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CurrentScreen;

const styles = StyleSheet.create({});
