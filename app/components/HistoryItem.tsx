import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";

type Props = {
  item: { lotId: string };
};

const HistoryItem = ({ item }: Props) => {
  const [lotName, setLotName] = useState();
  const [lotRate, setLotRate] = useState();

  useEffect(() => {
    if (item.lotId)
      (async () => {
        const lotSnap = await getDoc(doc(db, "lots", item.lotId));
        setLotName(lotSnap.data()?.name);
        setLotRate(lotSnap.data()?.rate);
      })();
  }, [item.lotId]);

  return (
    <View>
      <Text>{lotName}</Text>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({});
