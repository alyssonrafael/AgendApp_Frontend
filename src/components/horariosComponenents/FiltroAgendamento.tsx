import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { ThemedButton } from "@/src/components/ThemedButton";

//props para o componete
type FiltrosAgendamentoProps = {
  selectedDate?: Date | null; // Data selecionada no filtro (opcional)
  sortOption: "alphabetical" | "newest" | "oldest"; //opçao da ordenaçao
  showDateFilter?: boolean; //indica se o filtro de data sera exibido
  hasFilters: boolean; //indica se havera ou nao firtro a ser exibido
  onDatePress?: () => void; //preciona para abrir o filtro de data
  onSortPress: () => void; //pecionado para fazer a troca do filtro de ordenaçao
  onClearFilters: () => void; //limpa todos os filtros
};

export const FiltrosAgendamento = ({
  selectedDate,
  sortOption,
  hasFilters,
  onDatePress,
  onSortPress,
  onClearFilters,
  showDateFilter = true, // Valor padrão true para manter compatibilidade
}: FiltrosAgendamentoProps) => {
  //cores personalizadas para o tema selecionado 
  const filterTextColor = useThemeColor(
    { light: "#666", dark: "#a3a3a3" },
    "text"
  );
  const filterBackgroundColor = useThemeColor(
    { light: "rgba(166, 166, 166, 0.1)", dark: "rgba(255, 255, 255, 0.1)" },
    "background"
  );

  return (
    <>
      {/* Filtro por data (condicional) */}
      {showDateFilter && (
        <View style={styles.dateFilterContainer}>
          <ThemedButton
            onPress={onDatePress || (() => {})} // Usa função vazia se onDatePress não for fornecido
            icon={<Ionicons name="calendar-outline" size={22} color={"white"} />}
            title={
              selectedDate
                ? selectedDate.toLocaleDateString("pt-BR") // formato brasileiro da data exibido
                : "Filtrar por data" //texto padrao se a data nao for selecionada 
            }
            style={{ margin: 0, width: "100%" }}
          />
        </View>
      )}

      {/* Container dos botões de filtro e limpar filtro */}
      <View
        style={[
          styles.filterButtonsContainer,
          // Ajuste de margem quando não tem date filter
          !showDateFilter && { marginTop: 10 },
        ]}
      >
        {/* Botão de limpar filtros (só aparece se tiver filtros aplicados) */}
        {hasFilters && (
          <TouchableOpacity
            style={[
              styles.clearFiltersButton,
              { backgroundColor: filterBackgroundColor },
            ]}
            onPress={onClearFilters}
          >
            <Ionicons name="close-circle" size={16} color={filterTextColor} />
            <Text style={[styles.clearFiltersText, { color: filterTextColor }]}>
              Limpar filtros
            </Text>
          </TouchableOpacity>
        )}

        {/* Botão de ordenação */}
        <TouchableOpacity
          style={[
            styles.sortButton,
            { backgroundColor: filterBackgroundColor },
          ]}
          onPress={onSortPress}
        >
          <Ionicons
            name="filter"
            size={20}
            color={filterTextColor}
            style={styles.sortIcon}
          />
          <Text style={[styles.sortText, { color: filterTextColor }]}>
            {/* Mostra texto de acordo com o tipo de ordenação selecionado */}
            {sortOption === "alphabetical"
              ? "A-Z"
              : sortOption === "newest"
              ? "Recentes"
              : "Antigos"}
          </Text>
          <Ionicons name="swap-vertical" size={16} color={filterTextColor} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dateFilterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  sortIcon: {
    marginRight: 6,
  },
  sortText: {
    marginRight: 4,
    fontSize: 14,
  },
  clearFiltersText: {
    marginLeft: 6,
    fontSize: 14,
  },
});
