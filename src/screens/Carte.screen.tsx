import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { getData } from "../services/donee.service";
import { PointOfInterest } from "../types/index";
import PointsInteretMap from "../components/Carte";

export const CarteScreen: React.FC = () => {
  const [places, setPlaces] = React.useState<PointOfInterest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // recuperation des lieu depuis l API
  const fetchPlaces = async () => {
    try {
      // Appel du service pour récupérer les données

      const response = await getData({
        name: "",
        id: "",
        type: "museum",
        coordinates: { latitude: 0, longitude: 0 },
        address: "",
      });
      if (response.success) {
        // Ensure response.data is always an array
        if (Array.isArray(response.data)) {
          setPlaces(response.data);
        } else if (response.data) {
          setPlaces([response.data]);
        } else {
          setPlaces([]);
        }
      } else {
        console.error("Erreur lors de la récupération des données");
      }
    } catch (error) {
      setError(
        "Impossible de contacter le serveur. Vérifiez votre connexion réseau.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect exécuté une seule fois au montage du composant
  // Il lance la récupération des données

  React.useEffect(() => {
    fetchPlaces();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Réessayer" onPress={fetchPlaces} color="#007AFF" />
      </View>
    );
  }

  // Une fois les données chargées
  // on affiche la carte avec les lieux
  return (
    <View style={{ flex: 1 }}>
      <PointsInteretMap
        places={places
          .filter((p: any) => p.lat_lon)
          .map((p: any) => ({
            nom_usuel: p.title || p.address_name,
            coordonnees_geo: {
              lat: p.lat_lon.lat,
              lon: p.lat_lon.lon,
            },
          }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
