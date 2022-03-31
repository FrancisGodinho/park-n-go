import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Headers from "../constants/Headers";
import { useGlobalContext } from "../utils/context";
import HistoryItem from "../components/HistoryItem";
import ParkingAPI from "../api/ParkingAPI";

type Props = {};

const HistoryScreen = (props: Props) => {
  const { parkingHistory } = useGlobalContext();
  //<HistoryItem id={1} item={parkingHistory[0]}/>
  //<HistoryItem id={2} item={parkingHistory[0]}/>
  //<HistoryItem id={3} item={parkingHistory[0]}/>
  //<HistoryItem id={4} item={parkingHistory[0]}/>
  //<HistoryItem id={5} item={parkingHistory[0]}/>
  //<HistoryItem id={6} item={parkingHistory[0]}/>
  //<HistoryItem id={7} item={parkingHistory[0]}/>
  //<HistoryItem id={8} item={parkingHistory[0]}/>
  return (
    <SafeAreaView>
      <Text style={{ marginBottom: 20, ...Headers.h1 }}>Parking History</Text>
      <ScrollView>
        {parkingHistory && parkingHistory.length > 0 ? (
          parkingHistory
            //.sort((item1, item2) => {
            //  // sort by decreasing start date
            //  return (item2.start?.seconds ?? 0) - (item1.start?.seconds ?? 0);
            //})
            .reverse()
            .map((history, idx) => {
              history["duration"] = history.end - history.start;
              return <HistoryItem id={idx} item={history} key={idx} />;
            })
        ) : (
          <Text style={Headers.h2}>No Parking History Yet...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
