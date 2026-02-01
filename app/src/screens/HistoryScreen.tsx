import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ObjectCard from "../components/ObjectCard";
import { getHistory, AnalysisResult } from "../services/api";

type RootStackParamList = {
  MainTabs: undefined;
  Result: { result: AnalysisResult };
};

export default function HistoryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(null);
      getHistory()
        .then((data) => {
          if (active) setItems(data);
        })
        .catch(() => {
          if (active) setError("Impossible de charger l'historique.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Aucune analyse pour le moment</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ObjectCard
          item={item}
          onPress={() => navigation.navigate("Result", { result: item })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  list: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
  },
});
