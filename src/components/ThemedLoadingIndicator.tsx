import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

type Props = {
  message?: string;
};

// componente para indicar loading de forma generalista recebe o texto ou o texto padrao Carregando com um spin
export const ThemedLoadingIndicator = ({
  message = "Carregando...",
}: Props) => {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" />
      <ThemedText style={styles.text}>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
});
