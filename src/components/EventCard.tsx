import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { UrbanEvent } from "../types";
type EventCardProps = {
  event: UrbanEvent;
  onPress?: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const toggleFavorite = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);

    if (newStatus) {
      Alert.alert("Succès", `${event.title} a été ajouté aux favoris`, [
        { text: "Compris", style: "default" },
      ]);
    }
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={{ uri: event.cover_url }} style={styles.image} />
        {/* <View style={styles.cardContent}> */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.category}>{event.qfap_tags?.split(";")[0]}</Text>
          <Text style={styles.address} numberOfLines={1}>
            {event.address_name}
          </Text>
          {/* favorite */}
          <TouchableOpacity style={styles.favoriteBtn} onPress={toggleFavorite}>
            <Text style={{ fontSize: 30 }}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    minHeight: 270,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  info: {
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
    color: "#222",
  },
  category: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  address: {
    fontSize: 13,
    color: "#666",
  },
  favoriteBtn: {
    position: "absolute",
    top: 30,
    right: 12,
    zIndex: 10,
    padding: 6,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default EventCard;
