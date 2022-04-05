import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Animated,
  Text,
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
        };
        setLotCoords(coords);
      })();
    }
  }, [lotId]);

  return (
    <Modal transparent visible={showModal}>
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
            <MapView style={styles.map} showsUserLocation>
              <Marker
                coordinate={lotCoords}
                title={lotName}
                id={lotId}
                description={"PARKADE"}
              />
            </MapView>
            <View>
              <Text style={styles.text}>{lotName}</Text>
              <Text style={styles.text}>{date}</Text>
              <Text style={styles.text}>
                {startTime}-{endTime}
              </Text>
              <Text style={[Headers.h2, styles.text]}>${cost}</Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
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
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  header: {
    width: "100%",
    height: 30,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  content: {
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Avenir-Black",
    fontSize: 20,
    fontWeight: "500",
    color: Colors.lightGray,
  },
  map: {
    alignSelf: "stretch",
    height: "75%",
    borderRadius: 20,
  },
});
