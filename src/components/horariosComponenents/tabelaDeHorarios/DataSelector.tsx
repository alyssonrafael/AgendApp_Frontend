import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../../ThemedText";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Interface que define as propriedades do componente
interface DateSelectorProps {
  dates: string[];                // Array de datas no formato "YYYY-MM-DD"
  selectedDate: string | null;    // Data atualmente selecionada
  onSelectDate: (date: string) => void; // Função chamada ao selecionar uma data
  lightColor?: string;            // Cor opcional para o tema claro
  darkColor?: string;             // Cor opcional para o tema escuro
}

// Componente para seleção horizontal de datas
const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  lightColor,
  darkColor,
  selectedDate,
  onSelectDate,
}) => {
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

  // Cores padrão para o estado ativo (selecionado)
  const defaultActiveBackground = "#007BFF";
  const defaultActiveText = "#fff";

  // Obtém cores do tema ou usa valores padrão
  const backgroundColorDayCard = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundCard"
  );

  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  // Cores para o estado ativo
  const activeBackgroundColorDayCard = useThemeColor(
    {
      light: defaultActiveBackground,
      dark: defaultActiveBackground,
    },
    "backgroundCard"
  );

  const activeTextColor = useThemeColor(
    { light: defaultActiveText, dark: defaultActiveText },
    "text"
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dateSelector}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Mapeia cada data para criar um botão de seleção */}
      {dates.map((date) => {
        const dayName = getDayName(date); // Obtém nome do dia (ex: "Segunda")
        const [year, month, day] = date.split("-");
        const formattedDate = `${day}/${month}`; // Formata como "DD/MM"

        return (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateButton,
              { backgroundColor: backgroundColorDayCard },
              // Aplica estilos diferentes quando a data está selecionada
              selectedDate === date && {
                backgroundColor: activeBackgroundColorDayCard,
                ...styles.activeDateButton,
              },
            ]}
            onPress={() => onSelectDate(date)}
          >
            {/* Exibe o nome do dia (ex: "Segunda") */}
            <ThemedText
              style={[
                styles.dateText,
                { color: textColor },
                selectedDate === date && {
                  color: activeTextColor,
                  ...styles.activeDateText,
                },
              ]}
            >
              {dayName}
            </ThemedText>
            
            {/* Exibe a data formatada (ex: "05/03") */}
            <ThemedText
              style={[
                styles.dateText,
                { color: textColor },
                selectedDate === date && {
                  color: activeTextColor,
                  ...styles.activeDateText,
                },
              ]}
            >
              {formattedDate}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dateSelector: {
    marginVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dateButton: {
    marginRight: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    padding: 8,
    elevation: 2,
  },
  activeDateButton: {
    shadowColor: "#6200ee",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeDateText: {
    fontWeight: "bold",
  },
});

export default DateSelector;
