import { StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

// interface com a prop para o componente de lista vazia
interface Props {
  searchTerm: string;
}

export default function AgendamentoListEmpty({ searchTerm }: Props) {
  return (
    <ThemedView style={styles.emptyContainer}>
      <Ionicons
        name="calendar-outline"
        size={40}
        style={styles.emptyIcon}
        color={"gray"}
      />
      {/* se houver um termo de busca exibe a primeira mensagem caso nao a segunda */}
      <ThemedText style={styles.emptyText}>
        {searchTerm
          ? "Nenhum resultado encontrado"
          : "Nenhuma reserva encontrada"}
      </ThemedText>
      {!searchTerm && (
        <Link href={"/(telasUsers)/agendamento"} asChild>
          <TouchableOpacity style={styles.emptyButton}>
            <ThemedText style={styles.emptyButtonText}>
              Agendar serviço
            </ThemedText>
          </TouchableOpacity>
        </Link>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});