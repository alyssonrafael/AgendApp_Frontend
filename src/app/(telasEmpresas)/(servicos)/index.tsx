import { Button, StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { router } from "expo-router";

export default function servicosScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Busaca de serviço  */}
      <ThemedText>ola essa e a tela de servicos na pasta</ThemedText>
      {/* lista de servicos com cards */}
      <ThemedText>ola essa e a tela de servicos na pasta</ThemedText>
      {/* botao que leva para o cadastro */}
      <Button
        onPress={() => {
          router.push("/(telasEmpresas)/(servicos)/cadastroServico");
        }}
        title="rota para cadastro"
      />
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
