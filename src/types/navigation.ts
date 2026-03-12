import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { UrbanEvent } from "./index";

export type DiscoveryStackParamList = {
  DiscoveryList: undefined;
  Detail: { event: UrbanEvent };
};

export type TabParamList = {
  DecouverteTab: undefined;
  Carte: undefined;
  MonProfil: undefined;
};

export type DiscoveryNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<DiscoveryStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

export type DetailScreenRouteProp = RouteProp<DiscoveryStackParamList, "Detail">;

export type RootStackParamList = {
  MainTabs: undefined;
};
