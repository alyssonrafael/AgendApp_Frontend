import React, { useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { Modal, StyleSheet, Animated } from "react-native";
import { ThemedView } from "../../ThemedView";
import { ThemedText } from "../../ThemedText";
import { ThemedButton } from "../../ThemedButton";
import IndisponibilidadeItem from "./IndisponibilidadeItem";
import AgendamentoDetalhes from "./AgendamentoDetalhes";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { useGradeHorarios } from "@/src/context/GradeHorariosContext";

// Interface para um horário disponível
interface HorarioDisponivel {
  horario: string;
  ocupado: boolean;
  indisponivel: boolean;
}

// Interface para um agendamento
interface Agendamento {
  cliente: {
    nome: string;
    telefone: string;
  };
  servico: {
    nome: string;
    duracao: number;
    custo: number;
  };
  data: string;
  horario: string;
  id: string;
}

// Interface para as props do modal
interface TimeSlotModalProps {
  visible: boolean;
  onClose: () => void;
  selectedHorario: HorarioDisponivel | null;
  selectedDate: string | null;
  agendamentoNoHorario: Agendamento | null;
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({
  visible,
  onClose,
  selectedHorario,
  selectedDate,
  agendamentoNoHorario,
}) => {
  // Obtém as indisponibilidades do contexto
  const { indisponibilidades } = useGradeHorarios();

  // Estados para controlar o popup de cópia
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Animação para o popup
  const popupOpacity = useRef(new Animated.Value(0)).current;

  // Função para encontrar indisponibilidades no horário selecionado
  const getIndisponibilidadesNoHorario = () => {
    if (!selectedDate || !selectedHorario) return [];

    // Converte o horário para minutos
    const [horaAtual, minutoAtual] = selectedHorario.horario
      .split(":")
      .map(Number);
    const horarioAtualMinutos = horaAtual * 60 + minutoAtual;

    // Filtra as indisponibilidades que afetam este horário
    return indisponibilidades.filter((ind) => {
      const [inicioStr, fimStr] = ind.horario.split("-");
      const [inicioHora, inicioMinuto] = inicioStr.split(":").map(Number);
      const [fimHora, fimMinuto] = fimStr.split(":").map(Number);

      const inicioMinutos = inicioHora * 60 + inicioMinuto;
      const fimMinutos = fimHora * 60 + fimMinuto;

      // Verifica se o horário está dentro do intervalo de indisponibilidade
      const horarioDentroDoIntervalo =
        horarioAtualMinutos >= inicioMinutos &&
        horarioAtualMinutos < fimMinutos;

      if (!horarioDentroDoIntervalo) return false;

      // Normaliza as datas para comparação
      const normalizeDate = (dateString: string) => {
        return new Date(dateString).toISOString().split("T")[0];
      };

      // Retorna true se for indisponibilidade global ou específica para esta data
      return (
        !ind.data || normalizeDate(ind.data) === normalizeDate(selectedDate)
      );
    });
  };

  // Obtém as indisponibilidades para o horário atual
  const indisponibilidadesNoHorario = getIndisponibilidadesNoHorario();

  // Cores do popup adaptáveis ao tema
  const backgroundPopupColor = useThemeColor(
    { light: "#F7F7F7", dark: "#121212" },
    "background"
  );
  const textPopupColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");

  // Função para copiar texto para a área de transferência
  const copyToClipboard = async (text: string, type: string) => {
    await Clipboard.setStringAsync(text);
    setPopupMessage(`${type} copiado!`);
    showPopup();
  };

  // Animação para mostrar o popup
  const showPopup = () => {
    setShowCopiedPopup(true);
    Animated.sequence([
      Animated.timing(popupOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCopiedPopup(false));
  };

  return (
    <ThemedView>
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            {selectedHorario && selectedDate && (
              <>
                {/* Título do modal com horário e data */}
                <ThemedText style={styles.modalTitle}>
                  {selectedHorario.horario} -{" "}
                  {selectedDate.split("-").reverse().join("/")}
                </ThemedText>

                {/* Indicador visual do status do horário */}
                <ThemedView style={styles.modalStatusContainer}>
                  <ThemedView
                    style={[
                      styles.statusIndicator,
                      selectedHorario.ocupado && styles.occupiedIndicator,
                      selectedHorario.indisponivel &&
                        styles.unavailableIndicator,
                      !selectedHorario.ocupado &&
                        !selectedHorario.indisponivel &&
                        styles.availableIndicator,
                    ]}
                  />

                  <ThemedText style={styles.modalStatusText}>
                    {selectedHorario.ocupado
                      ? "Horário ocupado"
                      : selectedHorario.indisponivel
                      ? "Horário indisponível"
                      : "Horário disponível"}
                  </ThemedText>
                </ThemedView>

                {/* Exibe detalhes do agendamento se existir */}
                {agendamentoNoHorario && (
                  <AgendamentoDetalhes
                    agendamento={agendamentoNoHorario}
                    copyToClipboard={copyToClipboard}
                  />
                )}

                {/* Mensagem para agendamento sem detalhes */}
                {!agendamentoNoHorario && selectedHorario.ocupado && (
                  <ThemedText style={styles.modalMessage}>
                    Este horário está ocupado, mas não encontramos os detalhes
                    do agendamento.
                  </ThemedText>
                )}

                {/* Lista de indisponibilidades para este horário */}
                {indisponibilidadesNoHorario.map((ind, index) => (
                  <IndisponibilidadeItem
                    key={index}
                    id={ind.id}
                    horario={ind.horario}
                    motivo={ind.motivo}
                    data={ind.data}
                    copyToClipboard={copyToClipboard}
                  />
                ))}

                {/* Mensagem para horário disponível */}
                {!selectedHorario.ocupado && !selectedHorario.indisponivel && (
                  <ThemedText style={styles.modalMessage}>
                    Horário disponível para agendamento.
                  </ThemedText>
                )}

                {/* Popup de confirmação de cópia */}
                {showCopiedPopup && (
                  <Animated.View
                    style={[
                      styles.popupContainer,
                      {
                        opacity: popupOpacity,
                        backgroundColor: backgroundPopupColor,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.popupText, { color: textPopupColor }]}
                    >
                      {popupMessage}
                    </ThemedText>
                  </Animated.View>
                )}
              </>
            )}

            {/* Botão para fechar o modal independente de qual seja */}
            <ThemedButton onPress={onClose} title={"Fechar"}/>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  availableIndicator: {
    backgroundColor: "#4CAF50",
  },
  occupiedIndicator: {
    backgroundColor: "#F44336",
  },
  unavailableIndicator: {
    backgroundColor: "#FFC107",
  },
  modalStatusText: {
    fontSize: 16,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  // Estilos do popup
  popupContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  popupText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontSize: 14,
  },
});

export default TimeSlotModal;
