import { StyleSheet } from "react-native";
import Colors from "./Colors";

const Headers = StyleSheet.create({
  h1: {
    fontFamily: "Avenir-Black",
    fontSize: 25,
    fontWeight: "900",
    color: Colors.darkWhite,
    textAlign: "center",
  },
  h2: {
    fontFamily: "Avenir-Black",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.darkWhite,
  },
  p: {
    fontFamily: "Avenir-Black",
    fontSize: 17,
    fontWeight: "400",
    color: Colors.darkWhite,
  },
});

export default Headers;
