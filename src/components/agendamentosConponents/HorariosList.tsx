import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { useThemeColor } from "@/src/hooks/useThemeColor";
// inteface de como os horarios vem da req para a api
interface Horario {
  horario: string;
  ocupado: boolean;
  indisponivel: boolean;
}
// props para montar a lista de horarios
interface HorariosListProps {
  horarios: Horario[];
  selectedHorario: string | null;
  onSelectHorario: (horario: string) => void; // ao precionar passa o horario para o pai
}

const HorariosList: React.FC<HorariosListProps> = ({
  horarios,
  selectedHorario,
  onSelectHorario,
}) => {
  // cores personalizadas para o fundo dos card de horarios
  const timeSlotBackground = useThemeColor(
    { light: "#e9f5ff", dark: "#1a2c3a" },
    "backgroundCard"
  );

  return (
    <View style={styles.container}>
      {/* exibe apenas os horarios disponiveis */}
      {horarios
        .filter((h) => !h.ocupado && !h.indisponivel)
        .map((horario) => (
          <TouchableOpacity
            key={horario.horario}
            style={[
              styles.button,
              { backgroundColor: timeSlotBackground },
              selectedHorario === horario.horario && styles.selectedButton,
            ]}
            onPress={() => onSelectHorario(horario.horario)}
          >
            <ThemedText
              style={[
                styles.text,
                selectedHorario === horario.horario && styles.selectedText,
              ]}
            >
              {horario.horario}
            </ThemedText>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    minWidth: 70,
    width: 70,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HorariosList;
