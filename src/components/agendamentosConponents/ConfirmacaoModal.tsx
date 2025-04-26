import React from "react";
import { Modal, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
// props para montar o modal de confirmaçao para o agendamento
interface ConfirmacaoModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  servicoNome: string;
  data: string;
  horario: string;
  loading?: boolean;
}

export const ConfirmacaoModal: React.FC<ConfirmacaoModalProps> = ({
  visible,
  onClose,
  onConfirm,
  servicoNome,
  data,
  horario,
  loading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="fade"
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>
            Confirmar Agendamento
          </ThemedText>

          <ThemedText style={styles.modalText}>{servicoNome}</ThemedText>

          <ThemedText style={styles.modalText}>
            {data} às {horario}
          </ThemedText>

          <ThemedView style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <ThemedText style={styles.modalCancelButtonText}>
                Cancelar
              </ThemedText>
            </TouchableOpacity>
            {/* botao de confirmaçao do agendamento */}
            <ThemedButton
              title="Confirmar"
              onPress={onConfirm}
              style={[styles.modalConfirmButton, { margin: 0 }]}
              textStyle={[
                styles.modalConfirmButtonText,
                { fontWeight: "normal", fontSize: 16 },
              ]}
              isLoading={loading}
              disabled={loading}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "semibold",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },
  modalConfirmButton: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#333",
  },
  modalConfirmButtonText: {
    color: "#fff",
  },
});
