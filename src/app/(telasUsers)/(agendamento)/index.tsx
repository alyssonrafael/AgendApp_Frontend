import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { router } from "expo-router";

export default function AgendamentoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>ola essa e a tela de Agendamento</ThemedText>
      <TouchableOpacity
        onPress={() => router.push("/(telasUsers)/(agendamento)/empresa")}
      >
        <ThemedText>ir para empresa</ThemedText>
      </TouchableOpacity>
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
