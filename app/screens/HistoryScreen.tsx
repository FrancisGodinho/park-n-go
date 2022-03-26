import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React , {useState, useEffect} from "react";
import ParkingAPI from "../api/ParkingAPI";

type Props = {};

const HistoryScreen = (props: Props) => {
  const [value, setValue] = useState<string>("test");

  useEffect(async ()=>{
    const data = await ParkingAPI.getTest();
    setValue(data);
    const data2 = await ParkingAPI.postTest("hello");
    console.log(data2);
    const data3 = await ParkingAPI.getTestParam("haha");
    console.log(data3);
  });

  return (
    <SafeAreaView>
      <View>
        <Text style={{color: "white"}}>HistoryScreen</Text>
        <Text style={{color: "white"}}>{value}</Text>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
