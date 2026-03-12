import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { Text } from "react-native";

const PARIS_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface Place {
  nom_usuel: string;
  coordonnees_geo: {
    lat: number;
    lon: number;
  };
}

interface MapProps {
  places: Place[];
}

const PointsInteretMap: React.FC<MapProps> = ({ places }) => {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={PARIS_REGION}>
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.coordonnees_geo.lat,
              longitude: place.coordonnees_geo.lon,
            }}
            title={place.nom_usuel}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default PointsInteretMap;
