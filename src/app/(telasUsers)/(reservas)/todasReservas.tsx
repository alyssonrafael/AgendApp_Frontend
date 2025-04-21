import { useState, useMemo } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";
import { useAgendamentoUser } from "@/src/context/AgendamentosUserContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedButton } from "@/src/components/ThemedButton";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import AgendamentoCard from "@/src/components/reservasUserComponents/AgendamentoCard";
import AgendamentoListEmpty from "@/src/components/reservasUserComponents/AgendamentoListEmpty";
import ModalAgendamentoDetalhes from "@/src/components/reservasUserComponents/ModalAgendamentoDetalhes";

const PAGE_SIZE = 5; // Define quantos itens são carregados por página

const TodasReservas = () => {
  // Obtém dados e funções do contexto de agendamentos
  const { agendamentos, loading, loadAgendamentos, setAgendamentoSelecionado } =
    useAgendamentoUser();

  // Estados do componente
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca
  const [refreshing, setRefreshing] = useState(false); // Estado de refresh
  const [page, setPage] = useState(1); // Página atual para paginação
  const [loadingMore, setLoadingMore] = useState(false); // Estado de carregar mais itens

  // Filtra os agendamentos de acordo com o termo de busca usando o memo para performace
  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        agendamento.servico.nome.toLowerCase().includes(searchLower) ||
        agendamento.servico.empresa.nomeEmpresa
          .toLowerCase()
          .includes(searchLower) ||
        agendamento.dataFormatada.toLowerCase().includes(searchLower) ||
        agendamento.horario.toLowerCase().includes(searchLower)
      );
    });
  }, [agendamentos, searchTerm]);

  // Calcula os agendamentos visíveis com base na paginação
  const visibleAgendamentos = useMemo(() => {
    return filteredAgendamentos.slice(0, page * PAGE_SIZE);
  }, [filteredAgendamentos, page]);

  // Função para atualizar a lista
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAgendamentos();
    setPage(1); // Reseta para a primeira página
    setRefreshing(false);
  };

  // Função para carregar mais itens
  const handleLoadMore = () => {
    if (
      !loadingMore &&
      visibleAgendamentos.length < filteredAgendamentos.length
    ) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }
  };

  // Componente para o rodapé da lista (loading ou botão "Mostrar mais")
  const ListFooterComponent = () => {
    if (loadingMore) {
      return <ActivityIndicator size="small" style={styles.loadingMore} />;
    }

    if (visibleAgendamentos.length < filteredAgendamentos.length) {
      return (
        <ThemedButton
          title="Mostrar mais agendamentos"
          onPress={handleLoadMore}
        />
      );
    }

    return null;
  };

  // Mostra indicador de loading durante o carregamento inicial
  if (loading && !refreshing) {
    return <ThemedLoadingIndicator message="Carregando agendamentos... " />;
  }

  return (
    <ThemedView style={styles.container}>
      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <ThemedInput
            type="outlined"
            icon={<Ionicons name="search" size={18} color={"gray"} />}
            placeholder="Buscar por empresa, serviço ou data"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>
        {/* Botão para limpar a pesquisa */}
        {searchTerm ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchTerm("")}
          >
            <Ionicons name="close-circle" size={18} color={"gray"} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Lista de agendamentos */}
      <FlatList
        data={visibleAgendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AgendamentoCard
            agendamento={item}
            onPress={() => setAgendamentoSelecionado(item)}
          />
        )} //componente a ser renderizado
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<AgendamentoListEmpty searchTerm={searchTerm} />} //componente se estiver vazia
        ListFooterComponent={<ListFooterComponent />} //componente do footer
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Permite tocar na lista mesmo com teclado aberto
      />

      {/* Modal para detalhes do agendamento */}
      <ModalAgendamentoDetalhes />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  loadMoreButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  loadMoreText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  loadingMore: {
    marginVertical: 16,
  },
});

export default TodasReservas;
