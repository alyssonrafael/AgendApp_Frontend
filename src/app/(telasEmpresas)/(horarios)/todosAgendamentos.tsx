import { StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";

export default function todosAgendamentos() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>todosAgendamentos</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
});
