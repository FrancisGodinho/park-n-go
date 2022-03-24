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
import { doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { auth, db } from "./Firebase";

type ContextState = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isParking: boolean;
  setIsParking: Dispatch<SetStateAction<boolean>>;
  startTime: Timestamp;
  setStartTime: Dispatch<SetStateAction<Timestamp>>;
  lotId: string;
  setLotId: Dispatch<SetStateAction<string>>;
  lotName: string;
  setLotName: Dispatch<SetStateAction<string>>;
};

const defaultValues: ContextState = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isParking: false,
  setIsParking: () => {},
  startTime: Timestamp.now(),
  setStartTime: () => {},
  lotId: "",
  setLotId: () => {},
  lotName: "",
  setLotName: () => {},
};

const AppContext = createContext<ContextState>(defaultValues);

const AppProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    defaultValues.isAuthenticated
  );
  const [isParking, setIsParking] = useState<boolean>(defaultValues.isParking);
  const [startTime, setStartTime] = useState<Timestamp>(
    defaultValues.startTime
  );
  const [lotId, setLotId] = useState<string>(defaultValues.lotId);
  const [lotName, setLotName] = useState<string>(defaultValues.lotName);

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
        setStartTime(doc.data()?.startTime);
        setLotId(doc.data()?.lotId);
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
        startTime,
        setStartTime,
        lotId,
        setLotId,
        lotName,
        setLotName,
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
