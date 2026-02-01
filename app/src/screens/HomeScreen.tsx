import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PhotoPicker from "../components/PhotoPicker";
import { analyzeImage, AnalysisResult } from "../services/api";

type RootStackParamList = {
  MainTabs: undefined;
  Result: { result: AnalysisResult };
};

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleImageSelected = async (uri: string) => {
    setLoading(true);
    try {
      const result = await analyzeImage(uri);
      navigation.navigate("Result", { result: { ...result, imageUri: uri } });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'analyser l'image. Vérifiez votre connexion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preciso</Text>
      <Text style={styles.subtitle}>
        Identifiez et estimez la valeur de vos objets
      </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Analyse en cours...</Text>
        </View>
      ) : (
        <PhotoPicker onImageSelected={handleImageSelected} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 48,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
