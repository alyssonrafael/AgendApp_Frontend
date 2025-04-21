import { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAgendamentoUser } from "@/src/context/AgendamentosUserContext";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import { ModalConfirmacao } from "@/src/components/reservasUserComponents/ModalConfirmacao";
import AgendamentoCard from "@/src/components/reservasUserComponents/AgendamentoCard";
import ModalAgendamentoDetalhes from "@/src/components/reservasUserComponents/ModalAgendamentoDetalhes";
import AgendamentoListEmpty from "@/src/components/reservasUserComponents/AgendamentoListEmpty";

export default function ReservasScreen() {
  // Contexto e estados
  const {
    agendamentos,
    setAgendamentoSelecionado,
    loading,
    loadDelete,
    loadAgendamentos,
    deleteAgendamento,
  } = useAgendamentoUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState<string | null>(
    null
  );

  // Função para atualizar a lista
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAgendamentos();
    setRefreshing(false);
  };

  // Prepara para deletar um agendamento
  const handleDelete = (id: string) => {
    setAgendamentoToDelete(id);
    setShowConfirmModal(true);
  };

  // Confirma e executa a exclusão
  const confirmDelete = async () => {
    if (!agendamentoToDelete) return;

    try {
      await deleteAgendamento(agendamentoToDelete);
      await onRefresh(); // Atualiza a lista após exclusão
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      // fecha o modal e reseta o estado
      setShowConfirmModal(false);
      setAgendamentoToDelete(null);
    }
  };

  // Filtra e ordena agendamentos futuros
  const obterAgendamentosFuturos = () => {
    const agora = new Date();

    return agendamentos
      .map((ag) => {
        const dataISO = ag.data.split("T")[0];
        const dataCompleta = new Date(`${dataISO}T${ag.horario}:00`);
        return { ...ag, dataCompleta };
      })
      .filter((ag) => ag.dataCompleta >= agora)
      .sort((a, b) => a.dataCompleta.getTime() - b.dataCompleta.getTime());
  };

  const agendamentosFuturos = obterAgendamentosFuturos();

  // Filtra agendamentos conforme termo de busca usa o memo para performace
  const filteredAgendamentos = useMemo(() => {
    return agendamentosFuturos.filter((agendamento) => {
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
  }, [agendamentosFuturos, searchTerm]);

  // Mostra loading durante carregamento inicial
  if (loading && !refreshing) {
    return <ThemedLoadingIndicator message="Carregando agendamentos..." />;
  }

  return (
    <ThemedView style={styles.container}>
      {/* Seção principal (90% da tela) */}
      <View style={styles.topSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Reservas Ativas ({agendamentosFuturos.length})
        </ThemedText>

        {/* Campo de busca */}
        <ThemedInput
          type="outlined"
          icon={<Ionicons name="search" size={18} color={"gray"} />}
          placeholder="Buscar por empresa, serviço ou data"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />

        {/* Lista de agendamentos */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredAgendamentos} //dados que seram renderizados
          renderItem={({ item }) => (
            <AgendamentoCard
              agendamento={item}
              onPress={() => setAgendamentoSelecionado(item)}
              showDelete={true}
              onDelete={() => handleDelete(item.id)}
            />
          )} //renderiza cada item da lista
          keyExtractor={(item) => item.id.toString()} //otimiza extraindo um id para cada item
          contentContainerStyle={styles.listContainer} //estilo da lista
          ListEmptyComponent={<AgendamentoListEmpty searchTerm={searchTerm} />} //componente se vazia
          refreshing={refreshing} //estado de caregamento
          onRefresh={onRefresh} //funçao para refresh
        />
      </View>

      {/* Rodapé (10% da tela) */}
      <View style={styles.bottomSection}>
        <Link href={"/(telasUsers)/(reservas)/todasReservas"} asChild>
          <TouchableOpacity style={styles.buttonLink}>
            <Ionicons name="list-outline" size={24} color="gray" />
            <ThemedText style={styles.buttonLinkText}>
              Todas as reservas
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Modais */}
      {/* modal de detalhes */}
      <ModalAgendamentoDetalhes />
      {/* modal para exclusao */}
      <ModalConfirmacao
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar exclusão"
        message="Tem certeza que deseja cancelar este agendamento? Essa ação não pode ser desfeita!"
        loading={loadDelete}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  topSection: {
    flex: 9,
    marginTop: 10,
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bottomSection: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  buttonLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonLinkText: {
    fontSize: 16,
    marginLeft: 12,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  searchInput: {
    fontSize: 14,
  },
});
