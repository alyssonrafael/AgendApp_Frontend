import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";

// componente para quando nao houver resultados para empresa buscada
const EmptyResults = ({
  searchTerm,
  onRetry,
  loading,
}: {
  searchTerm: string;
  onRetry: () => void;
  loading: boolean;
}) => (
  <ThemedView style={styles.emptyContainer}>
    <MaterialIcons
      name="search-off"
      size={48}
      color="gray"
      style={styles.emptyIcon}
    />

    <ThemedText type="subtitle" style={styles.emptyTitle}>
      {searchTerm
        ? "Nenhum resultado encontrado"
        : "Nenhuma empresa disponível"}
    </ThemedText>

    {searchTerm ? (
      <ThemedText style={styles.emptyText}>
        Não encontramos empresas com o termo "{searchTerm}"
      </ThemedText>
    ) : (
      <ThemedText style={styles.emptyText}>
        Parece que não há empresas cadastradas no momento. Ou possivelmente houve um erro se o
        conportamento persistir contate o suporte.
      </ThemedText>
    )}

    <ThemedButton
      title={searchTerm ? "Limpar busca" : "Recarregar"}
      onPress={onRetry}
      isLoading={loading}
    />
  </ThemedView>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#555",
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#777",
    lineHeight: 22,
  },
});

export default EmptyResults;
