import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { AppProvider } from "./utils/context";

export default function App() {
  const isLoadingComplete = useCachedResources();

  LogBox.ignoreLogs([
    "AsyncStorage has been extracted from react-native core and will be removed in a future release",
  ]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <AppProvider>
          <Navigation />
        </AppProvider>
      </SafeAreaProvider>
    );
  }
}
