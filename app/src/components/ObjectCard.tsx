import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AnalysisResult } from "../services/api";

interface ObjectCardProps {
  item: AnalysisResult;
  onPress?: () => void;
}

export default function ObjectCard({ item, onPress }: ObjectCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.epoch} numberOfLines={1}>
          {item.epoch}
        </Text>
        <Text style={styles.value}>{item.estimatedValue}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: "#e5e7eb",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  epoch: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
    marginTop: 4,
  },
});
