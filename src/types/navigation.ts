import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
export type RootStackParamList = {
  MonProfil: undefined;
  Decouverte: undefined;
  // a modifier

  Carte: undefined;
  Detail: { id: string };
};
export type MonProfilNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MonProfil"
>;
export type DecouverteNavigationProp = RouteProp<
  RootStackParamList,
  "Decouverte"
>;
export type CarteNavigationProp = RouteProp<RootStackParamList, "Carte">;
