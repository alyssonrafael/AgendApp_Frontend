// Importações de bibliotecas e componentes necessários
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedView } from "../../ThemedView";
import { ThemedText } from "../../ThemedText";

// Interface que define a estrutura de um agendamento para apresentar detalhes
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

// Interface para as propriedades do componente
interface AgendamentoDetalhesProps {
  agendamento: Agendamento; // Objeto contendo os dados do agendamento
  copyToClipboard: (text: string, type: string) => Promise<void>; // Função para copiar texto
}

// Componente principal que exibe os detalhes de um agendamento
const AgendamentoDetalhes: React.FC<AgendamentoDetalhesProps> = ({
  agendamento,
  copyToClipboard,
}) => {
  return (
    <ThemedView style={styles.agendamentoInfo}>
      {/* Título da seção */}
      <ThemedText style={styles.sectionTitle}>
        Detalhes do Agendamento
      </ThemedText>

      {/* Linha com o ID do agendamento */}
      <ThemedView style={styles.infoRow}>
        <MaterialIcons
          name="lock-outline"
          size={16}
          style={styles.icon}
          color="#666"
        />
        <ThemedText style={styles.infoText}>
          {agendamento.id.slice(0, 8)}...{agendamento.id.slice(-4)}
        </ThemedText>
        <TouchableOpacity
          onPress={() => copyToClipboard(agendamento.id, "Id do agendamento")}
          style={styles.copyButton}
        >
          <MaterialIcons name="content-copy" size={16} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <Ionicons name="person-outline" size={16} style={styles.icon} />
        <ThemedText style={styles.infoText}>
          {agendamento.cliente.nome}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <Ionicons name="call-outline" size={16} style={styles.icon} />
        <ThemedText style={styles.infoText}>
          {agendamento.cliente.telefone}
        </ThemedText>
        <TouchableOpacity
          onPress={() =>
            copyToClipboard(agendamento.cliente.telefone, "Telefone")
          }
          style={styles.copyButton}
        >
          <MaterialIcons name="content-copy" size={16} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <Ionicons name="briefcase-outline" size={16} style={styles.icon} />
        <ThemedText style={styles.infoText}>
          {agendamento.servico.nome}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} style={styles.icon} />
        <ThemedText style={styles.infoText}>
          inicio: {agendamento.horario}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} style={styles.icon} />
        <ThemedText style={styles.infoText}>
          Duração: {agendamento.servico.duracao} minutos
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <Ionicons name="cash-outline" size={16} style={styles.icon} />
        <ThemedText style={styles.infoText}>
          R$ {agendamento.servico.custo.toFixed(2)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  agendamentoInfo: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    width: 24,
    textAlign: "center",
    color: "#666",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    maxWidth: "90%",
  },
  copyButton: {
    marginLeft: "auto",
    paddingLeft: 10,
    padding: 4,
  },
});

export default AgendamentoDetalhes;
