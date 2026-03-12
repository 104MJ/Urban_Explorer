import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface CameraProps {
  onPhotoTaken: (uri: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onPhotoTaken }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>L'accès à la caméra est nécessaire</Text>
        <Button title="Accorder la permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.5 });

    if (photo) {
      setPhotoUri(photo.uri);
      onPhotoTaken(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.image} />
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} />
      )}

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Prendre une photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderRadius: 10,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: 250,
  },
  button: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Camera;
