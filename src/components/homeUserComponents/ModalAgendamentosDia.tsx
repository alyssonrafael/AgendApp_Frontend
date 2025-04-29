import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { useAgendamentoUser } from "@/src/context/AgendamentosUserContext";

export default function ModalAgendamentosDia() {
  // recupera informaçoes do contexto de agendamentos sobre os agendamentos do dia selecionado e controle de abertura do modal
  const {
    dataSelecionada,
    agendamentosDoDia,
    setDataSelecionada,
    setAgendamentoSelecionado,
  } = useAgendamentoUser();
  // se nao houver data selecionada o modal nao abre
  if (!dataSelecionada) return null;

  return (
    <Modal
      visible={!!dataSelecionada}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setDataSelecionada(null)}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDataSelecionada(null)}
          >
            <Ionicons name="close" size={24} color={"gray"} />
          </TouchableOpacity>
          <View style={styles.header}>
            <ThemedText style={styles.title}>
              Agendamentos em{" "}
              {new Date(dataSelecionada).toLocaleDateString("pt-BR")}
            </ThemedText>
          </View>
          {/* faz um map dos agendamentos do dia e coloca na lista, se nao houver nenhum exibe a mensagem  */}
          {agendamentosDoDia.length > 0 ? (
            <FlatList
              data={agendamentosDoDia}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setAgendamentoSelecionado(item);
                  }}
                >
                  <ThemedText style={styles.horario}>{item.horario}</ThemedText>
                  <ThemedText style={styles.servico}>
                    {item.servico.nome}
                  </ThemedText>
                  <ThemedText style={styles.empresa}>
                    {item.servico.empresa.nomeEmpresa}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={60} color="#ccc" />
              <ThemedText style={styles.emptyTitle}>
                Nenhum agendamento
              </ThemedText>
              <ThemedText style={styles.emptyMessage}>
                Você não tem agendamentos para este dia
              </ThemedText>
            </View>
          )}
          {/* botao para fechar o modal sempre acessivel  */}
          <ThemedButton
            title="Fechar"
            onPress={() => setDataSelecionada(null)}
            style={styles.footerButton}
          />
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
    alignItems: "flex-end",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  horario: {
    fontWeight: "bold",
    fontSize: 16,
  },
  servico: {
    fontSize: 14,
  },
  empresa: {
    fontSize: 12,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    maxWidth: "80%",
  },
  footerButton: {
    marginTop: 20,
  },
});
