import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { router } from "expo-router";

export const ServiceNotFound = () => {
  return (
    <ThemedView style={styles.container}>
      <Ionicons name="close-circle-outline" size={60} color={"#007AFF"} />
      <ThemedText style={styles.text}>Serviço não encontrado</ThemedText>
      <ThemedButton title="Voltar" onPress={() => router.back()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    padding: 12,
    marginTop: 25,
  },
});
