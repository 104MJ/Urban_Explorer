import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./src/types/navigation";

// import MonProfilScreen from "../screens/MonProfilScreen";
// import DecouverteScreen from "../screens/DecouverteScreen";
// import CarteScreen from "../screens/CarteScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Decouverte" */}

      {/* > */}
      {/* <Stack.Screen name="MonProfil" component={MonProfilScreen} />
                <Stack.Screen name="Decouverte" component={DecouverteScreen} />
                <Stack.Screen name="Carte" component={CarteScreen} /> */}

      {/* </Stack.Navigator> */}
    </NavigationContainer>
  );
}
