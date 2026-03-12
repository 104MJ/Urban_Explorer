import React, { useRef } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface CameraProps {
  onPhotoTaken: (uri: string) => void;
}

const CameraCapture: React.FC<CameraProps> = ({ onPhotoTaken }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

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
    if (cameraRef) {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.5 });
      if (photo) {
        onPhotoTaken(photo.uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Prendre une photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: "black",
    borderRadius: 10,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "80%",
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
export default CameraCapture;
