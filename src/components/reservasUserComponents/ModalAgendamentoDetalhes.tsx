import { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { useAgendamentoUser } from "@/src/context/AgendamentosUserContext";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedButton } from "@/src/components/ThemedButton";

export const ModalAgendamentoDetalhes: React.FC = () => {
  //hooks do contexto para manipular o agendamento selecionado
  const { agendamentoSelecionado, setAgendamentoSelecionado } =
    useAgendamentoUser();
  // estados parra controle do popup
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const popupOpacity = useState(new Animated.Value(0))[0];

  const backgroundPopupColor = useThemeColor(
    { light: "#fff", dark: "#121212" },
    "background"
  );

  // funçao do popup para campos copiados
  const copyToClipboard = async (text: string, type: string) => {
    await Clipboard.setStringAsync(text);
    setPopupMessage(`${type} copiado!`);
    showPopup();
  };
  // animaçao do popup
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

  // se nao houver agendamento selecionado e null e nao mostra
  if (!agendamentoSelecionado) return null;

  return (
    <Modal
      visible={!!agendamentoSelecionado}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setAgendamentoSelecionado(null)}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          {/* Cabeçalho FIXO */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.modalTitle}>
              Detalhes do Agendamento
            </ThemedText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAgendamentoSelecionado(null)}
            >
              <Ionicons name="close" size={24} color={"gray"} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo com SCROLL */}
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Seção da Empresa */}
            <View style={styles.section}>
              <ThemedText type="subtitle">Empresa</ThemedText>
              <View style={styles.infoRow}>
                <Ionicons
                  name="business-outline"
                  size={16}
                  style={styles.icon}
                />
                <ThemedText style={styles.infoText}>
                  {agendamentoSelecionado.servico.empresa.nomeEmpresa}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={styles.infoRow}
                onPress={() =>
                  copyToClipboard(
                    agendamentoSelecionado.servico.empresa.email,
                    "E-mail da empresa"
                  )
                }
              >
                <Ionicons name="mail-outline" size={16} style={styles.icon} />
                <ThemedText style={styles.infoText}>
                  {agendamentoSelecionado.servico.empresa.email}
                </ThemedText>
                <Ionicons
                  name="copy-outline"
                  size={16}
                  style={styles.copyIcon}
                />
              </TouchableOpacity>
              {/* so e apresentado caso a empresa tenha telefone cadastrado */}
              {agendamentoSelecionado.servico.empresa.telefone && (
                <TouchableOpacity
                  style={styles.infoRow}
                  onPress={() =>
                    copyToClipboard(
                      agendamentoSelecionado.servico.empresa.telefone,
                      "Telefone da empresa"
                    )
                  }
                >
                  <Ionicons name="call-outline" size={16} style={styles.icon} />
                  <ThemedText style={styles.infoText}>
                    {agendamentoSelecionado.servico.empresa.telefone}
                  </ThemedText>
                  <Ionicons
                    name="copy-outline"
                    size={16}
                    style={styles.copyIcon}
                  />
                </TouchableOpacity>
              )}
              {/* so e apresentado se a empresa tiver endereço cadastrado */}
              {agendamentoSelecionado.servico.empresa.endereco && (
                <View style={styles.infoRow}>
                  <Ionicons name="map-outline" size={16} style={styles.icon} />
                  <ThemedText style={styles.infoText}>
                    {agendamentoSelecionado.servico.empresa.endereco}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            {/* Seção do Agendamento */}
            <View style={styles.section}>
              <ThemedText type="subtitle">Agendamento</ThemedText>
              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  style={styles.icon}
                />
                <ThemedText style={styles.infoText}>{agendamentoSelecionado.dataFormatada}</ThemedText>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} style={styles.icon} />
                <ThemedText style={styles.infoText}>{agendamentoSelecionado.horario}</ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Seção do Serviço */}
            <View style={styles.section}>
              <ThemedText type="subtitle">Serviço</ThemedText>
              <View style={styles.infoRow}>
                <Ionicons name="cut-outline" size={16} style={styles.icon} />
                <ThemedText style={styles.infoText}>{agendamentoSelecionado.servico.nome}</ThemedText>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} style={styles.icon} />
                <ThemedText style={styles.infoText}>
                  {agendamentoSelecionado.servico.duracao} minutos
                </ThemedText>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={16} style={styles.icon} />
                <ThemedText style={styles.infoText}>
                  {agendamentoSelecionado.servico.custo.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
                </ThemedText>
              </View>
            </View>
          </ScrollView>

          {/* Botões para fechar */}
          <ThemedButton
            title="Fechar"
            onPress={() => setAgendamentoSelecionado(null)}
          />

          {/* Popup de confirmação */}
          {showCopiedPopup && (
            <Animated.View
              style={[styles.popupContainer, { opacity: popupOpacity }]}
            >
              <ThemedView
                style={[
                  styles.popupContent,
                  { backgroundColor: backgroundPopupColor },
                ]}
              >
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <ThemedText style={styles.popupText}>{popupMessage}</ThemedText>
              </ThemedView>
            </Animated.View>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    maxHeight: "60%", // Altura máxima do modal
    borderRadius: 12,
    padding: 20,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentContainer: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  section: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 2,
    paddingVertical: 4,
    flexShrink: 1,
    flexWrap:"wrap"
  },
  infoText: {
    flex: 1, 
    flexWrap: 'wrap', 
    marginLeft: 4, 
    maxWidth: '90%', 
  },
  icon: {
    marginRight: 10,
    width: 20,
    color: "#666",
  },
  copyIcon: {
    marginLeft: "auto",
    paddingLeft: 10,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 4,
  },
  popupContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  popupContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#D3d3d3",
  },
  popupText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontSize: 14,
  },
});

export default ModalAgendamentoDetalhes;
