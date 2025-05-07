import { useState, useRef, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Interface que define as propriedades do componente
interface CustomTimePickerProps {
  visible: boolean; // Controla se o modal está visível
  onClose: () => void; // Função chamada ao fechar o modal
  onTimeSelected: (time: string) => void; // Função chamada quando um horário é selecionado
  initialTime?: string; // Horário inicial (padrão "08:00")
  hourLabel?: string; // Rótulo para as horas (padrão "Horas")
  minuteLabel?: string; // Rótulo para os minutos (padrão "Minutos")
}

const ITEM_HEIGHT = 50; // Altura fixa para cada item da lista

// Componente principal do seletor de horário personalizado
const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  visible,
  onClose,
  onTimeSelected,
  initialTime = "08:00",
  hourLabel = "Horas",
  minuteLabel = "Minutos",
}) => {
  // Estados para armazenar horas e minutos selecionados
  const [hours, setHours] = useState("08");
  const [minutes, setMinutes] = useState("00");

  // Refs para os ScrollViews de horas e minutos
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // Cores temáticas para o fundo dos itens
  const itemBackground = useThemeColor(
    { light: "#F7F7F7", dark: "#121212" },
    "backgroundCard"
  );
  const selectedItemBackground = useThemeColor(
    { light: "#4A90E2", dark: "#4A90E2" },
    "backgroundCard"
  );

  // Função para gerar arrays de horas e minutos formatados
  const generateItems = (length: number) =>
    Array.from({ length }, (_, i) => i.toString().padStart(2, "0"));

  // Arrays com todas as horas (00-23) e minutos (00-59)
  const hoursArray = generateItems(24);
  const minutesArray = generateItems(60);

  // Efeito que configura o horário inicial quando o modal é aberto
  useEffect(() => {
    if (visible) {
      // Divide o horário inicial em horas e minutos
      const [initHour, initMinute] = (initialTime ?? "08:00").split(":");
      const formattedHour = initHour.padStart(2, "0");
      const formattedMinute = initMinute.padStart(2, "0");

      // Atualiza os estados
      setHours(formattedHour);
      setMinutes(formattedMinute);

      // Encontra os índices dos valores iniciais
      const hourIndex = hoursArray.indexOf(formattedHour);
      const minuteIndex = minutesArray.indexOf(formattedMinute);

      // Rola os ScrollViews para as posições iniciais com um pequeno delay
      setTimeout(() => {
        hourScrollRef.current?.scrollTo({
          y: hourIndex * ITEM_HEIGHT,
          animated: false,
        });

        minuteScrollRef.current?.scrollTo({
          y: minuteIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, [visible, initialTime]);

  // Função para renderizar cada coluna de seleção (horas ou minutos)
  const renderPicker = (
    items: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
    isHour: boolean
  ) => {
    return (
      <ScrollView
        ref={isHour ? hourScrollRef : minuteScrollRef}
        style={styles.simpleScroll}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={`${isHour ? "hour" : "minute"}-${item}`}
            onPress={() => onSelect(item)}
            style={[
              styles.simpleItem,
              selectedValue === item && {
                backgroundColor: selectedItemBackground,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.simpleItemText,
                selectedValue === item && styles.selectedItemText,
              ]}
            >
              {item}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Funções para lidar com a seleção de horas e minutos
  const handleHourSelect = (hour: string) => {
    setHours(hour);
  };

  const handleMinuteSelect = (minute: string) => {
    setMinutes(minute);
  };

  // Função chamada ao confirmar a seleção
  const handleConfirm = () => {
    onTimeSelected(`${hours}:${minutes}`);
    onClose();
  };

  // Renderização do modal
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: itemBackground }]}
        >
          <ThemedText style={styles.title}>Selecione o Horário</ThemedText>

          <View style={styles.pickersContainer}>
            {/* Coluna de horas */}
            <View style={styles.column}>
              <ThemedText style={styles.label}>{hourLabel}</ThemedText>
              {renderPicker(hoursArray, hours, handleHourSelect, true)}
            </View>

            <ThemedText style={styles.timeSeparator}>:</ThemedText>

            {/* Coluna de minutos */}
            <View style={styles.column}>
              <ThemedText style={styles.label}>{minuteLabel}</ThemedText>
              {renderPicker(minutesArray, minutes, handleMinuteSelect, false)}
            </View>
          </View>

          {/* Botões de ação */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: selectedItemBackground },
              ]}
              onPress={handleConfirm}
            >
              <ThemedText style={styles.buttonText}>Confirmar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  column: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedItemText: {
    color: "white",
    fontWeight: "bold",
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  simpleScroll: {
    height: 200,
    width: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  simpleItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  simpleItemText: {
    fontSize: 20,
  },
});

export default CustomTimePicker;
