import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
import Colors from "../constants/Colors";

type Props = {
  item: {}
  id: number
};

const HistoryItem = ({item, id}: Props) => {

  const [lotName, setLotName] = useState("-");
  const [startTime, setStartTime] = useState<string>("-");
  const [endTime, setEndTime] = useState<string>("-");
  const [date, setDate] = useState<string>("-");
  const [cost, setCost] = useState<string>("-");

  useEffect(() => {
    if (item.lotId){
      (async () => {
        const lotSnap = await getDoc(doc(db, "lots", item.lotId));
        setLotName(lotSnap.data()?.name);
      })();
    }
  }, [item.lotId]);

  useEffect(()=>{
    if(item.start){
      var d1 = new Date(0);
      var d2 = new Date(0);
      d1.setUTCSeconds(item.start?.seconds);
      d2.setUTCSeconds(item.start?.seconds + item.duration * 60);
      setDate(d1.toLocaleDateString());
      setStartTime(d1.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}));
      setEndTime(d2.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}));
    }
    if(item.duration && item.rate){
      setCost((item.duration * item.rate).toFixed(2).toString());
    }
  }, [item.start, item.duration, item.rate]);

  return (
    <View style={{backgroundColor: id % 2 ? Colors.darkGray : Colors.black, ...styles.item}}>
      <View style={styles.rowStyle}>
        <Text style={{color: Colors.white, ...styles.fontStyle}}>{lotName}</Text>
        <Text style={{color: Colors.darkWhite, ...styles.fontStyle}}>{date}</Text>
      </View>
      <View style={styles.rowStyle}>
        <Text style={{color: Colors.primary, ...styles.fontStyle}}>${cost}</Text>
        <Text style={{color: Colors.darkWhite, ...styles.fontStyle}}>{startTime} - {endTime}</Text>
      </View>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  item: {
    height: 80,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  fontStyle:{
    fontSize: 18,
    fontWeight: "bold",

  },
  rowStyle:{
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-between"
  },
});
