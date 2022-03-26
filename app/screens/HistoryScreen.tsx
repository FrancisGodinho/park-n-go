import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Headers from "../constants/Headers";
import { useGlobalContext } from "../utils/context";
import HistoryItem from "../components/HistoryItem";

type Props = {};

const HistoryScreen = (props: Props) => {
  const { parkingHistory } = useGlobalContext();
  console.log(parkingHistory);

  const renderItem = (item: { lotId: string }) => {
    <HistoryItem item={item} />;
  };

  return (
    <SafeAreaView>
      <Text style={Headers.h1}>Parking History</Text>
      <FlatList data={parkingHistory} renderItem={HistoryItem} />
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
