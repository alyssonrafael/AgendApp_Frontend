import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { useColorScheme } from "@/src/hooks/useColorSchemeCustom";
import { View, StyleSheet } from "react-native";

// props recebidas pelo calendario
interface CalendarioProps {
  markedDates?: {
    [date: string]: {
      selected?: boolean;
      marked?: boolean;
      selectedColor?: string;
      dotColor?: string;
      disabled?: boolean;
    };
  };
  minDate?:string;
  onDayPress?: (day: DateData) => void;
}

export default function Calendario({ markedDates = {}, onDayPress, minDate }: CalendarioProps) {
  // usa o hook do esquema de cores personalizados
  const colorScheme = useColorScheme();

  // Configuração COMPLETA para português brasileiro
  LocaleConfig.locales["pt-br"] = {
    monthNames: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    monthNamesShort: [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ],
    dayNames: [
      "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
    ],
    dayNamesShort: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"],
    today: "Hoje"
  };

  LocaleConfig.defaultLocale = "pt-br";

  // Tema dinâmico
  const calendarTheme = {
    calendarBackground: colorScheme === "dark" ? "#1e1e1e" : "#f5f5f5",
    dayTextColor: colorScheme === "dark" ? "#ffffff" : "#2d4150",
    textDisabledColor: colorScheme === "dark" ? "#555555" : "#d9e1e8",
    monthTextColor: colorScheme === "dark" ? "#ffffff" : "#2d4150",
    textSectionTitleColor: colorScheme === "dark" ? "#ffffff" : "#2d4150",
    todayTextColor: colorScheme === "dark" ? "#4da6ff" : "#007AFF",
    selectedDayBackgroundColor: colorScheme === "dark" ? "#4da6ff" : "#007AFF",
    selectedDayTextColor: "#ffffff",
    arrowColor: colorScheme === "dark" ? "#4da6ff" : "#007AFF",
    indicatorColor: colorScheme === "dark" ? "#ffffff" : "#2d4150",
    "stylesheet.calendar.header": {
      week: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
      },
    },
  };

  // componente do calendario thematizado e ajustado para portugues
  return (
    <View style={styles.calendarContainer}>
    <Calendar
      markedDates={markedDates}
      onDayPress={onDayPress}
      theme={calendarTheme}
      monthFormat="MMMM yyyy"
      firstDay={1}
      key={colorScheme}
      enableSwipeMonths={true}
      locale="pt-br"
      minDate={minDate}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    marginBottom: 20,
  },
})