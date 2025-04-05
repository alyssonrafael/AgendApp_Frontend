import { StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

//componente para exibir mensagem de que nao existem agendamento
// e botao para mais opçoes oncentivando o usuario a completar o cadastro
export const AgendamentoEmpty = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.emptyTitle}>
        Nenhum Agendamento na sua empresa.
      </ThemedText>
      <ThemedText style={styles.emptyMessage}>
        Complete seu cadastro para aumentar a probabilidade de receber agendamentos!
      </ThemedText>
      <ThemedButton
        title="Atualizar dados"
        icon={<AntDesign name="pluscircleo" size={20} color="#FFF" />}
        onPress={() =>
          router.push("/(telasEmpresas)/(maisOpcoes)")
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
    marginHorizontal:30
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: "80%",
  },
});
