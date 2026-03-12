import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UrbanEvent } from "../types";

type EventCardProps = {
  event: UrbanEvent;
  onPress?: () => void;
};

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: event.cover_url }} style={styles.image} />
      {/* <View style={styles.cardContent}> */}
      <View>
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
      </View>
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     margin: 10,
//     overflow: "hidden",
//     elevation: 2,
//   },
//   image: {
//     width: "100%",
//     height: 150,
//   },
//   info: {
//     padding: 10,
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 18,
//     marginBottom: 5,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 4,
//   },
//   details: {
//     color: "#555",
//     fontSize: 14,
//   },
//   difficulty: {
//     fontWeight: "bold",
//     color: "#888",
//   },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   //
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     padding: 20,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#1a1a1a",
//   },
//   list: {
//     padding: 15,
//   },

//   category: {
//     fontSize: 14,
//     color: "#007AFF",
//     fontWeight: "600",
//     marginBottom: 5,
//     textTransform: "uppercase",
//   },
//   address: {
//     fontSize: 14,
//     color: "#666",
//   },
//   searchBar: {
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginVertical: 15,
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#dcdde1",
//     fontSize: 16,
//   },
//   favoriteBtn: {
//     position: "absolute",
//     top: 50,
//     right: 20,
//     zIndex: 10,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 20,
//     elevation: 5,
//   },
// });
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
