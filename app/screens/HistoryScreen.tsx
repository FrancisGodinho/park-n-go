import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Headers from "../constants/Headers";
import { useGlobalContext } from "../utils/context";
import HistoryItem from "../components/HistoryItem";
import ParkingAPI from "../api/ParkingAPI";

type Props = {};

const HistoryScreen = (props: Props) => {
  const { parkingHistory } = useGlobalContext();
  console.log(parkingHistory);

  const renderItem = (item: { lotId: string }) => {
    <HistoryItem item={item} />;
  };

  const [value, setValue] = useState<string>("test");

  useEffect(async () => {
    const data = await ParkingAPI.getTest();
    setValue(data);
    const data2 = await ParkingAPI.postTest("hello");
    console.log(data2);
    const data3 = await ParkingAPI.getTestParam("haha");
    console.log(data3);
  });

  return (
    <SafeAreaView>
      <Text style={Headers.h1}>Parking History</Text>
      <FlatList data={parkingHistory} renderItem={HistoryItem} />
      <View>
        <Text style={{ color: "white" }}>HistoryScreen</Text>
        <Text style={{ color: "white" }}>{value}</Text>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
