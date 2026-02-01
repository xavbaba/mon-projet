import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { AnalysisResult } from "../services/api";

type RootStackParamList = {
  Result: { result: AnalysisResult };
};

export default function ResultScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Result">>();
  const navigation = useNavigation();
  const { result } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {result.imageUri ? (
        <Image source={{ uri: result.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.card}>
        <Text style={styles.name}>{result.name}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Époque</Text>
          <Text style={styles.value}>{result.epoch}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Usage</Text>
          <Text style={styles.value}>{result.usage}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estimation de valeur</Text>
          <Text style={styles.estimatedValue}>{result.estimatedValue}</Text>
        </View>

        {result.description ? (
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{result.description}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Nouvelle analyse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 24,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 22,
  },
  estimatedValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
