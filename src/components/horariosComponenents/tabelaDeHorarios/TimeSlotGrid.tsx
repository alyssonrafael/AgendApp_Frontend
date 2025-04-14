import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Interface que define a estrutura de um horário disponível
interface HorarioDisponivel {
  horario: string; // Formato "HH:MM"
  ocupado: boolean; // Indica se o horário já está ocupado
  indisponivel: boolean; // Indica se o horário está indisponível
}

// Interface que define a estrutura da grade de horários
interface GradeHorario {
  id: string; // ID único da grade
  diaSemana: number; // Dia da semana (0-6)
  inicio: string; // Horário de início (ex: "08:00")
  fim: string; // Horário de término (ex: "18:00")
  intervalo: number; // Intervalo entre horários (em minutos)
  empresaId: string; // ID da empresa relacionada
}

// Interface que define as propriedades do componente
interface TimeSlotGridProps {
  horarios: HorarioDisponivel[]; // Lista de horários disponíveis
  gradeDoDia: GradeHorario | undefined; // Grade de horários do dia
  selectedDate: string; // Data selecionada (formato "YYYY-MM-DD")
  onHorarioPress: (horario: HorarioDisponivel) => void; // Função chamada ao selecionar um horário
}

// Componente que exibe uma grade de horários disponíveis
const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  horarios,
  gradeDoDia,
  selectedDate,
  onHorarioPress,
}) => {
  // Cores adaptáveis
  const timeSlotBackground = useThemeColor(
    { light: "#e9f5ff", dark: "#1a2c3a" },
    "backgroundCard"
  );

  const occupiedTimeSlotBackground = useThemeColor(
    { light: "#ffebee", dark: "#3a1d24" },
    "backgroundCard"
  );

  const unavailableTimeSlotBackground = useThemeColor(
    { light: "#fff8e1", dark: "#3a341d" },
    "backgroundCard"
  );

  const timeSlotTextColor = useThemeColor(
    { light: "#000000", dark: "#ffffff" },
    "text"
  );

  // Função para obter o nome do dia da semana a partir de uma data
  const getDayName = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return days[date.getDay()];
  };

  return (
    <ThemedView style={styles.timeSlotsContainer}>
      {/* Título com o dia da semana e data formatada */}
      <ThemedText style={styles.dateTitle}>
        {getDayName(selectedDate)},{" "}
        {selectedDate.split("-").reverse().join("/")}
      </ThemedText>

      {/* Grade de horários */}
      <ThemedView style={styles.timeSlotsGrid}>
        {/* Mapeia cada horário para criar um botão clicável */}
        {horarios?.map((horario, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timeSlot,
              { backgroundColor: timeSlotBackground }, // Cor padrão
              // Altera a cor se o horário estiver ocupado
              horario.ocupado && {
                backgroundColor: occupiedTimeSlotBackground,
              },
              // Altera a cor se o horário estiver indisponível
              horario.indisponivel && {
                backgroundColor: unavailableTimeSlotBackground,
              },
            ]}
            onPress={() => onHorarioPress(horario)} // Chama a função ao pressionar
          >
            {/* Texto do horário (HH:MM) */}
            <ThemedText
              style={[styles.timeSlotText, { color: timeSlotTextColor }]}
            >
              {horario.horario}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  timeSlotsContainer: {
    marginVertical: 15,
    borderRadius: 10,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  timeSlot: {
    padding: 10,
    borderRadius: 8,
    minWidth: 70,
    width: 70,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
});

export default TimeSlotGrid;
