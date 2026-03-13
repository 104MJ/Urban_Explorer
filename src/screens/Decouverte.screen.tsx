import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DiscoveryNavigationProp } from "../types/navigation";
import { UrbanEvent } from "../types";
import api from "../services/api.service";
import EventCard from "../components/EventCard";

const DiscoveryScreen: React.FC = () => {
  const [events, setEvents] = useState<UrbanEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<DiscoveryNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const filterEvents = useMemo(() => {
    if (!searchQuery) return events;
    const lowerQuery = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.qfap_tags?.toLowerCase().includes(lowerQuery),
    );
  }, [searchQuery, events]);
  const fetchEvents = async (pageNumber = 1) => {
    try {
      const response = await api.get("", {
        params: { limit: 30, page: pageNumber },
      });
      if (response.data && response.data.results) {
        if (pageNumber === 1) {
          setEvents(response.data.results);
        } else {
          setEvents((prevEvents) => [...prevEvents, ...response.data.results]);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!isFetchingMore) {
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }: { item: UrbanEvent }) => (
    <EventCard
      event={item}
      onPress={() => navigation.navigate("Detail", { event: item })}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Découverte</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher un événement..."
          placeholderTextColor="#95a5a6"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filterEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  list: {
    padding: 15,
  },

  searchBar: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 15,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdde1",
    fontSize: 16,
  },
});

export default DiscoveryScreen;
