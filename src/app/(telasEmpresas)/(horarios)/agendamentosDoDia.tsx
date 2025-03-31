import { StyleSheet } from "react-native";
import React from "react";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";

export default function agendamentosDoDia() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>agendamentosDoDia</ThemedText>
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
