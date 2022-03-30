import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/Firebase';
import Colors from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type Props = {
  //userId: number,
  historyId: number;
  isVisible: boolean;
  onClose: any;
};

const HistoryModal = ({ /*userId,*/ historyId, isVisible, onClose }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(isVisible);
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
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

export default HistoryModal;

const styles = StyleSheet.create({
  ModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
