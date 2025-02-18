import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedText } from "@/src/components/ThemedText";

export default function relatorio() {
  return (
    <View style={styles.containner}>
      <ThemedText>Relatorios</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  containner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
