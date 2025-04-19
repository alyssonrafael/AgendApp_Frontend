import { StyleSheet } from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";

const todasReservas = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>todasReservas</ThemedText>
    </ThemedView>
  );
};

export default todasReservas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
});
