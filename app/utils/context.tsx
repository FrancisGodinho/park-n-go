import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./Firebase";
import { LogBox } from "react-native";

type ContextState = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isParking: boolean;
  setIsParking: Dispatch<SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  startTime: Date | undefined;
  setStartTime: Dispatch<SetStateAction<Date | undefined>>;
  parkingHistory: Array<object>;
  setParkingHistory: Dispatch<SetStateAction<Array<object>>>;
  lotId: string;
  setLotId: Dispatch<SetStateAction<string>>;
  lotName: string;
  setLotName: Dispatch<SetStateAction<string>>;
  licensePlate: string;
  setLicensePlate: Dispatch<SetStateAction<string>>;
};

const defaultValues: ContextState = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isParking: false,
  setIsParking: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
  startTime: undefined,
  setStartTime: () => {},
  parkingHistory: [],
  setParkingHistory: () => {},
  lotId: "",
  setLotId: () => {},
  lotName: "",
  setLotName: () => {},
  licensePlate: "",
  setLicensePlate: () => {},
};

const AppContext = createContext<ContextState>(defaultValues);

const AppProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    defaultValues.isAuthenticated
  );
  const [isParking, setIsParking] = useState<boolean>(defaultValues.isParking);
  const [isAdmin, setIsAdmin] = useState<boolean>(defaultValues.isAdmin);
  const [startTime, setStartTime] = useState<Date | undefined>(
    defaultValues.startTime
  );
  const [parkingHistory, setParkingHistory] = useState<Array<object>>([]);
  const [lotId, setLotId] = useState<string>(defaultValues.lotId);
  const [lotName, setLotName] = useState<string>(defaultValues.lotName);

  const [licensePlate, setLicensePlate] = useState<string>(
    defaultValues.licensePlate
  );

  // Keep track of current user
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      (async () => {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
          } else {
            console.error("ERROR: user document doesn't exist");
          }
        }
      })();
    });
    return unsubscribeAuth;
  }, []);

  // Keep track of updates to userDoc (mainly to update isParking)
  useEffect(() => {
    let unsub;
    if (auth.currentUser) {
      unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
        setIsParking(doc.data()?.isParking);
        setStartTime(
          doc.data()?.isParking ? new Date(doc.data()?.startTime) : undefined
        );
        setLotId(doc.data()?.lotId);
        setLicensePlate(doc.data()?.licensePlate);
        setIsAdmin(doc.data()?.isAdmin);
      });
    }
    return unsub;
  }, [auth.currentUser]);

  // Keep track of updates to parking history
  useEffect(() => {
    let unsub;
    if (auth.currentUser) {
      unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
        setIsParking(doc.data()?.isParking);
        setStartTime(
          doc.data()?.isParking ? new Date(doc.data()?.startTime) : undefined
        );
        setLotId(doc.data()?.lotId);
        setParkingHistory(doc.data()?.parkingHistory ?? []);
        setParkingHistory(doc.data()?.parkingHistory);
      });
    }
    return unsub;
  }, [auth.currentUser]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isParking,
        setIsParking,
        isAdmin,
        setIsAdmin,
        startTime,
        setStartTime,
        parkingHistory,
        setParkingHistory,
        lotId,
        setLotId,
        lotName,
        setLotName,
        licensePlate,
        setLicensePlate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
