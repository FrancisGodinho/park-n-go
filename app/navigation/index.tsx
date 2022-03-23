import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";

import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import UserRegisterScreen from "../screens/UserRegisterScreen";

import { useGlobalContext } from "../utils/context";
import Colors from "../constants/Colors";
import { StackParamList, TabParamList, TabScreenProps } from "../types";
import AdminRegisterScreen from "../screens/AdminRegisterScreen";
import HistoryScreen from "../screens/HistoryScreen";
import CurrentScreen from "../screens/CurrentScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator<StackParamList>();

const MyTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.black },
};

export default function Navigation() {
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const { isAuthenticated, setIsAuthenticated } = useGlobalContext();

  let screens;

  const navigatorOptions: NativeStackNavigationOptions = {
    contentStyle: { backgroundColor: Colors.lightBlack },
    headerShown: false,
  };

  const screenOptions: NativeStackNavigationOptions = {
    animation: "none",
  };

  useEffect(() => {
    if (!isAuthenticated) {
      const timeout: NodeJS.Timeout = setTimeout(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      }, 5000);
      setTimer(timeout);
      return () => clearTimeout(timer as NodeJS.Timeout);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      clearTimeout(timer as NodeJS.Timeout);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Splash screen while app loading
  if (isLoading)
    screens = (
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={screenOptions}
      />
    );
  // Authentication screens if app finished loading but user not authenticated
  else if (!isLoading && !isAuthenticated)
    screens = (
      <>
        <Stack.Screen
          name="UserRegister"
          component={UserRegisterScreen}
          options={screenOptions}
        />
        <Stack.Screen
          name="AdminRegister"
          component={AdminRegisterScreen}
          options={screenOptions}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={screenOptions}
        />
      </>
    );
  else
    screens = (
      <>
        <Stack.Screen
          name="Tabs"
          component={BottomTabNavigator}
          options={screenOptions}
        />
      </>
    );

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={navigatorOptions}>
        {screens}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<TabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Current"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.lightBlack, borderTopWidth: 0 },
      }}
    >
      <BottomTab.Screen
        name="History"
        component={HistoryScreen}
        options={({ navigation }: TabScreenProps<"History">) => ({
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="book-open" color={color} solid size={25} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Current"
        component={CurrentScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="car" color={color} solid size={25} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" color={color} solid size={25} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={30} style={{ marginBottom: -3 }} {...props} />;
}
