import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedText } from "@/src/components/ThemedText";

export default function editarPerfil() {
  return (
    <View style={styles.container}>
      <ThemedText>editarPerfil</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center"
  },
});
