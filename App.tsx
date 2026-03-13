import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabParamList, DiscoveryStackParamList } from "./src/types/navigation";

import DiscoveryScreen from "./src/screens/Decouverte.screen";
import DetailScreen from "./src/screens/Detail.screen";
import { CarteScreen } from "./src/screens/Carte.screen";
import MonProfilScreen from "./src/screens/MonProfil.screen";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator<TabParamList>();
const DiscoveryStack = createNativeStackNavigator<DiscoveryStackParamList>();

function DiscoveryStackNavigator() {
  return (
    <DiscoveryStack.Navigator>
      <DiscoveryStack.Screen
        name="DiscoveryList"
        component={DiscoveryScreen}
        options={{ headerShown: false }}
      />
      <DiscoveryStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: "Détails" }}
      />
    </DiscoveryStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="DecouverteTab"
          component={DiscoveryStackNavigator}
          // options={{ title: "Découverte" }}
          options={{
            tabBarLabel: "Découverte",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Carte"
          component={CarteScreen}
          // options={{ title: "Carte" }}
          options={{
            tabBarLabel: "Carte",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="MonProfil"
          component={MonProfilScreen}
          // options={{ title: "Mon Profil" }}
          options={{
            tabBarLabel: "Profil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
