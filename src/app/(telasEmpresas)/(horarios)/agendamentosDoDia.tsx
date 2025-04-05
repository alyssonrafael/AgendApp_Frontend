import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useAgendamentos } from "@/src/context/AgendamentosEmpresaContext";
import { ModalDetalhes } from "@/src/components/horariosComponenents/ModalDetalhes";
import { AgendamentoCard } from "@/src/components/horariosComponenents/AgendamentoCard";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedView } from "@/src/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import { ThemedText } from "@/src/components/ThemedText";

export default function AgendamentosDoDia() {
  // Importa valores e funções do contexto de agendamentos
  const { agendamentos, loading, loadAgendamentos, setAgendamentoSelecionado } =
    useAgendamentos();
  //estado para armazenar o texto pesquisado
  const [searchText, setSearchText] = useState("");

  //data de hoje que sera exibida na tela
  const hoje = new Date();
  //formatando para data atual que sera comparada com o agendamento
  const hojeFormatado = hoje
    .toLocaleDateString("pt-BR")
    .split("/")
    .reverse()
    .join("-");

  // Filtra e ordena os agendamentos do dia atual
  const agendamentosDoDia = agendamentos
    .filter((ag) => {
      // Compara a parte da data (ignorando o horário)
      const dataAgendamento = ag.data.split("T")[0];
      return dataAgendamento === hojeFormatado;
    })
    .sort((a, b) => a.horario.localeCompare(b.horario)); // Ordena do mais cedo para o mais tarde

  // Filtro por texto de busca
  const filteredAgendamentos = agendamentosDoDia.filter((agendamento) => {
    return (
      agendamento.cliente.nome
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      agendamento.id.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Estado de carregamento
  if (loading && agendamentos.length === 0) {
    return <ThemedLoadingIndicator message="Carregando Agendamentos..." />;
  }

  // Componente para quando a lista está vazia
  const EmptyListComponent = () => (
    <View style={[styles.centerContainer, { flex: 1 }]}>
      <ThemedText style={styles.emptyMessage}>
        {agendamentosDoDia.length === 0
          ? "Nenhum agendamento para hoje"
          : searchText
          ? `Nenhum agendamento encontrado para "${searchText}"`
          : "Nenhum agendamento corresponde aos filtros"}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Barra de busca */}
      <ThemedInput
        value={searchText}
        placeholder={"Buscar por nome ou ID"}
        onChangeText={setSearchText}
        type="outlined"
        icon={<Ionicons name="search" size={20} color="gray" />}
      />

      <ThemedText style={styles.todayHeader}>
        {hoje.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </ThemedText>
      {/* conta quantos agendamento tem no dia */}
      <ThemedText style={styles.todayCount}>
        Agendamentos para hoje: {filteredAgendamentos.length}
      </ThemedText>

      {/* Lista de agendamentos comentada por conta da quandtidade de props passadas e conplexidade */}
      <FlatList
        // Lista de agendamentos filtrados para exibir
        data={filteredAgendamentos}
        // Define uma chave única para cada item (usando o id do agendamento)
        keyExtractor={(item) => item.id}
        // Define como renderizar cada item da lista
        renderItem={({ item }) => (
          <AgendamentoCard
            agendamento={item}
            // Define o agendamento selecionado ao clicar no card
            onPress={() => setAgendamentoSelecionado(item)}
          />
        )}
        // Indica se a lista está sendo atualizada (exibe loading ao puxar para atualizar)
        refreshing={loading}
        // Função chamada ao fazer "pull to refresh"
        onRefresh={loadAgendamentos}
        // Esconde a barra de rolagem vertical
        showsVerticalScrollIndicator={false}
        // Aplica estilo diferente se a lista estiver vazia
        contentContainerStyle={
          filteredAgendamentos.length === 0
            ? styles.emptyListContent // estilo quando a lista está vazia
            : styles.listContent // estilo quando há agendamentos
        }
        // Componente exibido quando a lista está vazia
        ListEmptyComponent={<EmptyListComponent />}
      />
      {/* Modal para detalhes do agendamento selecionado */}  
      <ModalDetalhes />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: "80%",
  },
  todayHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    textTransform: "capitalize",
  },
  todayCount: {
    fontSize: 14,
    textAlign: "center",
  },
});
