import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Share,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { DetailScreenRouteProp } from "../types/navigation";

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { event } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cet événement : ${event.title}\nPlus d'infos ici : ${event.contact_url || "Urban Explorer"}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false}>
        <Image source={{ uri: event.cover_url }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.category}>{event.qfap_tags?.split(";")[0]}</Text>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Date et Horaire</Text>
            <Text style={styles.text}>{event.date_description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Lieu</Text>
            <Text style={styles.placeName}>{event.address_name}</Text>
            <Text style={styles.text}>
              {event.address_street}, {event.address_zipcode}{" "}
              {event.address_city}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {event.contact_url && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => openUrl(event.contact_url)}
            >
              <Text style={styles.buttonText}>Voir le site officiel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Text style={styles.secondaryButtonText}>Partager</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  category: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "justify",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DetailScreen;
