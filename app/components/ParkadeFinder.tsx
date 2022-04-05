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
import HistoryItem from "./HistoryItem";
import ParkingAPI from "../api/ParkingAPI";
import {
  doc,
  getDocs,
  collection,
  collectionGroup,
  CollectionReference,
} from "firebase/firestore";
import { db } from "../utils/Firebase";
import MapView, { Marker } from "react-native-maps";
import { map } from "@firebase/util";

type Props = {};

const ParkadeFinder = (props: Props) => {
  const [parkades, setParkades] = useState([]);

  useEffect(() => {
    (async () => {
      const lots = await getDocs(collection(db, "lots"));
      const newParkades = [];
      lots.forEach((doc) => {
        const data = doc.data();
        newParkades.push({
          title: data.name,
          coordinate: {
            longitude: parseFloat(data.longitude),
            latitude: parseFloat(data.latitude),
          },
          description:
            "Rate is: $" +
            data.rate +
            " per hour, Capacity: " +
            ((data.currentNumCars * 100) / data.capacity)
              .toFixed(0)
              .toString() +
            "%",
          rate: data.rate,
        });
      });
      setParkades(newParkades);
    })();
  }, []);

  const COLORS = ["green", "yellow", "red"];
  return (
    <SafeAreaView>
      <Text style={{ marginTop: 5, marginBottom: 10, ...Headers.h1 }}>
        Find a parkade!
      </Text>
      <MapView
        style={{ alignSelf: "stretch", height: "100%" }}
        showsUserLocation
      >
        {parkades.map((parkade, idx) => {
          return (
            <Marker
              coordinate={parkade.coordinate}
              title={parkade.title}
              id={idx}
              key={idx}
              description={parkade.description}
              pinColor={COLORS[(parkade.rate > 2) + (parkade.rate > 5)]}
            />
          );
        })}
      </MapView>
    </SafeAreaView>
  );
};

export default ParkadeFinder;

const styles = StyleSheet.create({});
