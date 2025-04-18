// src/components/IndisponibilidadeCard.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Interface que define as props do componente
interface IndisponibilidadeCardProps {
  id: string; // ID único da indisponibilidade
  data: string | null; // Data no formato string ou null (para globais)
  horario: string; // Horário no formato "HH:MM-HH:MM"
  motivo: string | undefined; // Motivo da indisponibilidade
  onRemove: (id: string) => void; // Função chamada ao remover
  lightColor?: string; // Cor opcional para o tema claro
  darkColor?: string; // Cor opcional para o tema escuro
}

export function IndisponibilidadeCard({
  id,
  data,
  horario,
  motivo,
  onRemove,
  lightColor,
  darkColor,
}: IndisponibilidadeCardProps) {
  //funçao auxiliar para formatar o horario
  const formatHorario = (horario: string) => {
    const [inicio, fim] = horario.split("-");
    return `${inicio} às ${fim}`;
  };
  // funçao auxiliar para formatar a data ou exibir recorrente e tratar as datas invalidas
  const formatDataDisplay = (data: string | null) => {
    if (!data) return "Recorrente (Todos os dias)";
    try {
      if (data.includes("T")) {
        const dateObj = new Date(data);
        if (isNaN(dateObj.getTime())) return "Data inválida";

        const dia = String(dateObj.getUTCDate()).padStart(2, "0");
        const mes = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
        const ano = dateObj.getUTCFullYear();

        return `${dia}/${mes}/${ano}`;
      }

      if (data.includes(" ")) {
        const [datePart] = data.split(" ");
        const [ano, mes, dia] = datePart.split("-");
        return `${dia}/${mes}/${ano}`;
      }

      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  // Cores personalizadas para o card a depender do tema
  const cardBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundCard"
  );
  const secondaryTextColor = useThemeColor(
    { light: "#666", dark: "#a3a3a3" },
    "text"
  );
  return (
    <View style={[styles.container, { backgroundColor: cardBackground }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.data}>
            Data: {formatDataDisplay(data)}
          </ThemedText>
          <ThemedText style={[styles.periodo, { color: secondaryTextColor }]}>
            Id: {id.slice(0, 8)}...{id.slice(-4)}
          </ThemedText>
          <ThemedText style={[styles.periodo, { color: secondaryTextColor }]}>
            Horário: {formatHorario(horario)}
          </ThemedText>
          <ThemedText
            style={[styles.motivo, { color: secondaryTextColor }]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            Motivo: {motivo === "Unavailable time" ? "indisponível" : motivo}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(id)} // Chama a função passada via prop com  o ID
        >
          <Ionicons name="trash-outline" size={20} color={"#FF3B30"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  data: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
  },
  periodo: {
    marginBottom: 6,
    fontSize: 14,
  },
  motivo: {
    fontSize: 14,
    lineHeight: 20,
  },
  removeButton: {
    padding: 4,
    alignSelf: "center",
  },
});
