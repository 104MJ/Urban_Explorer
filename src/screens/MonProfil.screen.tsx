import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from "react-native";
import Camera from "../components/Camera";

const MonProfilScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  if (isCameraVisible) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cameraWrapper}>
          <Camera
            onPhotoTaken={(uri) => {
              setPhotoUri(uri);
              setIsCameraVisible(false);
            }}
            onClose={() => setIsCameraVisible(false)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.stats}>0 lieux visités</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsCameraVisible(true)}
        >
          <Text style={styles.actionButtonText}>Prendre un Selfie Souvenir</Text>
        </TouchableOpacity>

        {photoUri && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => setPhotoUri(null)}
          >
            <Text style={styles.secondaryButtonText}>Supprimer la photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  cameraWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  placeholderAvatar: {
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#8E8E93',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  stats: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 40,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#FF3B30',
  },
});

export default MonProfilScreen;
