import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Agendamento } from "../../context/AgendamentosEmpresaContext";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";

//props do componente
type AgendamentoCardProps = {
  agendamento: Agendamento; //recebe um agendamento
  lightColor?: string;
  darkColor?: string;
  onPress: () => void; // funçao chamda ao clicar no card
};

export const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  agendamento,
  onPress,
  darkColor,
  lightColor,
}) => {

  // Cores personalizadas para o card
  const cardBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundCard"
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const secondaryTextColor = useThemeColor(
    { light: "#666", dark: "#a3a3a3" },
    "text"
  );
  const badgetColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "badget"
  );
  const textBadgetColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textBadget"
  );

  return (
    //todo o card e clicavel e chama o onpress
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: cardBackground }]}
    >
      <View style={[styles.header]}>
        <Text style={[styles.nome, { color: textColor }]}>
          Cliente: {agendamento.cliente.nome}
        </Text>

        <View style={[styles.horarioBadge, { backgroundColor: badgetColor }]}>
          <ThemedText
            style={[styles.horarioBadgeText, { color: textBadgetColor }]}
          >
            {agendamento.horario}
          </ThemedText>
        </View>
      </View>
      <Text style={[styles.data, { color: secondaryTextColor }]}>
       Data: {agendamento.dataFormatada}
      </Text>
      <Text style={[styles.data, { color: secondaryTextColor }]}>
        ID: {agendamento.id.toString().slice(0, 6)}...
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  data: {
    fontSize: 14,
    color: "#666",
  },
  horarioBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  horarioBadgeText: {
    fontSize: 12,
  },
});
