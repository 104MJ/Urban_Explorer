import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import Camera from "../components/Camera";

const MonProfilScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 20, margin: 20 }}>Mon Profil</Text>
      <Camera onPhotoTaken={setPhotoUri} />
      {photoUri && (
        <View style={styles.preview}>
          <Text style={styles.label}>Photo Capturée :</Text>
          <Image source={{ uri: photoUri }} style={styles.image} />
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  preview: {
    marginTop: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default MonProfilScreen;
