import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { AnalysisResult, EbaySimilarItem } from "../services/api";

type RootStackParamList = {
  Result: { result: AnalysisResult };
};

function SimilarItemCard({ item }: { item: EbaySimilarItem }) {
  return (
    <TouchableOpacity
      style={styles.similarCard}
      onPress={() => item.link && Linking.openURL(item.link)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.similarImage} />
      ) : (
        <View style={[styles.similarImage, styles.placeholder]} />
      )}
      <View style={styles.similarInfo}>
        <Text style={styles.similarTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.similarPrice}>
          {item.price} {item.currency}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

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

      {result.similarItems && result.similarItems.length > 0 ? (
        <View style={styles.similarSection}>
          <Text style={styles.sectionTitle}>Ventes similaires (eBay)</Text>
          {result.similarItems.map((item, index) => (
            <SimilarItemCard key={index} item={item} />
          ))}
        </View>
      ) : null}

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
  similarSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  similarCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  similarImage: {
    width: 56,
    height: 56,
    borderRadius: 6,
  },
  placeholder: {
    backgroundColor: "#e5e7eb",
  },
  similarInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  similarTitle: {
    fontSize: 14,
    color: "#111827",
  },
  similarPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    marginTop: 4,
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
