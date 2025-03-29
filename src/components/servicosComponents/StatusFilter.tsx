import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Define as propriedades do componente
type StatusFilterProps = {
  showInactive: boolean; // Indica se o filtro de inativos está ativo
  inactiveCount: number; // Contador de itens inativos
  activeCount: number; // Contador de itens ativos
  onFilterChange: (showInactive: boolean) => void; // Callback quando o filtro muda
};

export const StatusFilter = ({
  showInactive, 
  inactiveCount,
  activeCount,
  onFilterChange,
}: StatusFilterProps) => {
  // Obtém cores personalizadas do tema (claro/escuro)
  const filterBackground = useThemeColor(
    { light: "#f0f0f0", dark: "#2a2a2a" },
    "background"
  );
  const activeFilterBackground = useThemeColor(
    { light: "#007AFF", dark: "#0a84ff" },
    "tint"
  );
  const filterTextColor = useThemeColor(
    { light: "#666", dark: "#a3a3a3" },
    "text"
  );
  const activeFilterTextColor = useThemeColor(
    { light: "#fff", dark: "#fff" },
    "text"
  );

  return (
    <View
      style={[styles.filterContainer, { backgroundColor: filterBackground }]}
    >
      {/* Botão para filtrar itens ATIVOS */}
      <TouchableOpacity
        // Aplica estilo diferente quando ativo
        style={[
          styles.filterButton,
          !showInactive && { backgroundColor: activeFilterBackground },
        ]}
        onPress={() => onFilterChange(false)} // Desativa o filtro de inativos
      >
        <ThemedText
          style={
            !showInactive
              ? { ...styles.activeFilterText, color: activeFilterTextColor }
              : { ...styles.filterText, color: filterTextColor }
          }
        >
          Ativos ({activeCount}) {/* Mostra contagem de ativos */}
        </ThemedText>
      </TouchableOpacity>
      {/* Botão para filtrar itens INATIVOS */}
      <TouchableOpacity
        // Aplica estilo diferente quando ativo
        style={[
          styles.filterButton,
          showInactive && { backgroundColor: activeFilterBackground },
        ]}
        onPress={() => onFilterChange(true)} // Ativa o filtro de inativos
      >
        <ThemedText
          style={
            showInactive
              ? { ...styles.activeFilterText, color: activeFilterTextColor }
              : { ...styles.filterText, color: filterTextColor }
          }
        >
          Inativos ({inactiveCount}) {/* Mostra contagem de inativos */}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
