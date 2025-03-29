import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Propriedades do filtro
type SortFilterProps = {
  sortOption: "alphabetical" | "newest" | "oldest"; //opções de filtro
  onSortChange: () => void; //callback para quando a opção muda
};

export const SortFilter = ({ sortOption, onSortChange }: SortFilterProps) => {
  // cores personalizadas para os temas (Claro/escuro)
  const filterTextColor = useThemeColor(
    { light: "#666", dark: "#a3a3a3" },
    "text"
  );
  const filterBackgroundColor = useThemeColor(
    { light: "rgba(166, 166, 166, 0.1)", dark: "rgba(255, 255, 255, 0.1)" },
    "background"
  );

  return (
    <View style={styles.sortContainer}>
      <TouchableOpacity
        style={[styles.sortButton, { backgroundColor: filterBackgroundColor }]}
        onPress={onSortChange}
      >
        <Ionicons
          name="filter"
          size={20}
          color={filterTextColor}
          style={styles.sortIcon}
        />
        {/* renderizaçao condicional do texto do filtro */}
        <ThemedText style={[styles.sortText, { color: filterTextColor }]}>
          {sortOption === "alphabetical" && "A-Z"}
          {sortOption === "newest" && "Mais Recentes"}
          {sortOption === "oldest" && "Mais Antigos"}
        </ThemedText>
        <Ionicons name="swap-vertical" size={16} color={filterTextColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sortContainer: {
    marginBottom: 12,
    alignItems: "flex-end",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  sortIcon: {
    marginRight: 6,
  },
  sortText: {
    marginRight: 4,
    fontSize: 14,
  },
});
