import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";

export default function empresas() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>empresas</ThemedText>
      <TouchableOpacity
        onPress={() =>
          router.push("/(telasUsers)/(agendamento)/detalhesAgendamento")
        }
      >
        <ThemedText>ir para confirmação</ThemedText>
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
