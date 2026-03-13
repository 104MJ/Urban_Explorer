import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Camera from "../components/Camera";
import { StorageService, PlannedVisit } from "../services/storage.service";
import { useFocusEffect } from "@react-navigation/native";
import * as Calendar from "expo-calendar";

const MonProfilScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [plannedVisits, setPlannedVisits] = useState<PlannedVisit[]>([]);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const loadSavedData = async () => {
    const savedPhoto = await StorageService.loadProfilePhoto();
    if (savedPhoto) setPhotoUri(savedPhoto);

    const savedVisits = await StorageService.loadPlannedVisits();
    
    // 1. Synchronisation avec l'agenda système
    const verifiedVisits: PlannedVisit[] = [];
    let needsUpdate = false;

    for (const visit of savedVisits) {
      try {
        const event = await Calendar.getEventAsync(visit.eventId);
        if (event) {
          verifiedVisits.push(visit);
        } else {
          needsUpdate = true; // L'événement n'existe plus dans l'agenda
        }
      } catch (e) {
        // En cas d'erreur (ex: permission), on garde par sécurité
        verifiedVisits.push(visit);
      }
    }

    // 2. Tri par date (du plus récent au plus ancien)
    const sortedVisits = verifiedVisits.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setPlannedVisits(sortedVisits);

    // 3. Mise à jour du stockage local si des visites ont été supprimées
    if (needsUpdate) {
      await StorageService.saveAllPlannedVisits(verifiedVisits);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedData();
    }, [])
  );

  useEffect(() => {

    const pulse = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(pulse).start();
  }, [scaleAnim]);

  if (isCameraVisible) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cameraWrapper}>
          <Camera
            onPhotoTaken={async (uri) => {
              setPhotoUri(uri);
              setIsCameraVisible(false);
              await StorageService.saveProfilePhoto(uri);
            }}
            onClose={() => setIsCameraVisible(false)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.placeholderText}>Pas d'avatar</Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>Explorateur Urbain</Text>
        <Text style={styles.stats}>
          {plannedVisits.length} lieu{plannedVisits.length > 1 ? "x" : ""} planifié{plannedVisits.length > 1 ? "s" : ""}
        </Text>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsCameraVisible(true)}
          >
            <Text style={styles.actionButtonText}>
              Prendre un Selfie Souvenir
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {photoUri && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={async () => {
              setPhotoUri(null);
              await StorageService.saveProfilePhoto(null);
            }}
          >
            <Text style={styles.secondaryButtonText}>Supprimer la photo</Text>
          </TouchableOpacity>
        )}

        <View style={styles.visitsSection}>
          <Text style={styles.sectionTitle}>📅 Mes Visites Planifiées</Text>
          {plannedVisits.length > 0 ? (
            plannedVisits.map((visit) => (
              <View key={visit.eventId} style={styles.visitCard}>
                <View style={styles.visitInfo}>
                  <Text style={styles.visitTitle}>{visit.eventTitle}</Text>
                  <Text style={styles.visitDate}>
                    {new Date(visit.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })} à {new Date(visit.date).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View style={styles.visitBadge}>
                  <Text style={styles.visitBadgeText}>Prévu</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyVisits}>
              <Text style={styles.emptyText}>Aucune visite planifiée pour le moment.</Text>
            </View>
          )}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  cameraWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    paddingTop: 50,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#007AFF",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  placeholderAvatar: {
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#8E8E93",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  stats: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 40,
    width: "80%",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
    marginTop: 15,
  },
  secondaryButtonText: {
    color: "#FF3B30",
  },
  visitsSection: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  visitCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  visitInfo: {
    flex: 1,
  },
  visitTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  visitDate: {
    fontSize: 13,
    color: "#8E8E93",
    textTransform: "capitalize",
  },
  visitBadge: {
    backgroundColor: "#EBF5FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  visitBadgeText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyVisits: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#C7C7CC",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 15,
    textAlign: "center",
  },
});

export default MonProfilScreen;
