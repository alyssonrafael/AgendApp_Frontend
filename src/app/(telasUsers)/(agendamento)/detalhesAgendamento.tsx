import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { StyleSheet } from "react-native";

export default function detalhesAgendamento() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>detalhesAgendamento / confirmaçao </ThemedText>
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
