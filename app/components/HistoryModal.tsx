import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Animated,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Headers from "../constants/Headers";
import MapView, { Marker } from "react-native-maps";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";

type Props = {
  lotId: string;
  lotName: string;
  startTime: string;
  endTime: string;
  date: string;
  cost: string;
  isVisible: boolean;
  onClose: any;
};

const HistoryModal = ({
  lotId,
  lotName,
  startTime,
  endTime,
  date,
  cost,
  isVisible,
  onClose,
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(isVisible);
  const [lotCoords, setLotCoords] = useState({
    longitude: 0,
    latitude: 0,
    longitudeDelta: 0,
    latitudeDelta: 0,
  });
  const scaleValue = useRef(new Animated.Value(0)).current;
  const toggleModal = () => {
    setShowModal(isVisible);
    if (isVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

  useEffect(() => {
    if (lotId) {
      (async () => {
        const lotSnap = await getDoc(doc(db, "lots", lotId));
        const coords = {
          longitude: lotSnap.data()?.longitude,
          latitude: lotSnap.data()?.latitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setLotCoords(coords);
      })();
    }
  }, [lotId]);

  return (
    <Modal transparent visible={showModal}>
      <TouchableWithoutFeedback
        style={{ width: "100%", height: "100%" }}
        onPress={() => {
          setShowModal(false);
          onClose();
        }}
      >
        <SafeAreaView style={styles.ModalBackground}>
          <Animated.View
            style={[
              styles.ModalContainer,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  onClose();
                }}
              >
                <Feather name="x" solid size={30} color={Colors.lightGray} />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <MapView
                style={styles.map}
                showsUserLocation
                initialRegion={lotCoords}
              >
                <Marker coordinate={lotCoords} title={lotName} id={lotId} />
              </MapView>
              <View>
                <Text
                  style={{
                    ...styles.text,
                    color: Colors.primary,
                    fontSize: 22,
                  }}
                >
                  {lotName}
                </Text>
                <Text style={styles.text}>{date}</Text>
                <Text style={styles.text}>
                  {startTime}
                  {" - "}
                  {endTime}
                </Text>
                <Text style={[Headers.h2, styles.text]}>${cost}</Text>
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HistoryModal;

const styles = StyleSheet.create({
  ModalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  ModalContainer: {
    width: "80%",
    height: "57%",
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightBlack,
  },
  header: {
    width: "100%",
    height: 30,
    alignItems: "flex-end",
  },
  content: {
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Avenir-Black",
    fontSize: 17,
    fontWeight: "500",
    color: Colors.lightGray,
  },
  map: {
    alignSelf: "stretch",
    height: "68%",
    borderRadius: 20,
  },
});
