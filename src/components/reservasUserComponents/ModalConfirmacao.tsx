import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";

// interface com as props para o modal
interface ModalConfirmacaoProps {
  visible: boolean;          // Controla se o modal está visível
  onClose: () => void;       // Função chamada ao fechar o modal
  onConfirm: () => void;     // Função chamada ao confirmar ação
  title: string;             // Título do modal
  message: string;           // Mensagem de conteúdo
  loading?: boolean;         // Indica se está em estado de carregamento (opcional)
}

export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  loading = false, // Valor padrão false para loading
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>
          <View style={styles.buttonsContainer}>
            <ThemedButton
              title="Cancelar"
              onPress={onClose}
              style={[styles.button, { backgroundColor: "gray" }]}
              textStyle={styles.textButton}
            />
            <ThemedButton
              title="Confirmar"
              onPress={onConfirm}
              style={[styles.button, { backgroundColor: "red" }]}
              textStyle={styles.textButton}
              isLoading={loading}
            />
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginRight: 10,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
