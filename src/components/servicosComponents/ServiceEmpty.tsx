import { StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export const ServiceEmpty = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.emptyTitle}>
        Nenhum serviço cadastrado
      </ThemedText>
      <ThemedText style={styles.emptyMessage}>
        Você ainda não possui serviços cadastrados em sua empresa
      </ThemedText>
      <ThemedButton
        title="Cadastrar primeiro serviço"
        icon={<AntDesign name="pluscircleo" size={20} color="#FFF" />}
        onPress={() =>
          router.push("/(telasEmpresas)/(servicos)/cadastroServico")
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: "80%",
  },
});
