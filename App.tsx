import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabParamList, DiscoveryStackParamList } from "./src/types/navigation";

import DiscoveryScreen from "./src/screens/Decouverte.screen";
import DetailScreen from "./src/screens/Detail.screen";
import { CarteScreen } from "./src/screens/Carte.screen";
import MonProfilScreen from "./src/screens/MonProfil.screen";

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
          options={{ title: "Découverte" }}
        />
        <Tab.Screen
          name="Carte"
          component={CarteScreen}
          options={{ title: "Carte" }}
        />
        <Tab.Screen
          name="MonProfil"
          component={MonProfilScreen}
          options={{ title: "Mon Profil" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
