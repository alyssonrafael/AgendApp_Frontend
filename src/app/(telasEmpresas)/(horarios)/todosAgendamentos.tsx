import React, { useState } from "react";
import { FlatList, StyleSheet, View, Modal } from "react-native";
import { useAgendamentos } from "@/src/context/AgendamentosEmpresaContext";
import { ModalDetalhes } from "@/src/components/horariosComponenents/ModalDetalhes";
import { AgendamentoCard } from "@/src/components/horariosComponenents/AgendamentoCard";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedView } from "@/src/components/ThemedView";
import { FiltrosAgendamento } from "@/src/components/horariosComponenents/FiltroAgendamento";
import { Ionicons } from "@expo/vector-icons";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import { ThemedText } from "@/src/components/ThemedText";
import { AgendamentoEmpty } from "@/src/components/horariosComponenents/AgendamentoEmpty";
import { ThemedButton } from "@/src/components/ThemedButton";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import Calendario from "@/src/components/homeUserComponents/Calendario";

export default function TodosAgendamentos() {
  // Importa valores e funções do contexto de agendamentos
  const { agendamentos, loading, loadAgendamentos, setAgendamentoSelecionado } =
    useAgendamentos();
  // Importa valores e funções do contexto de agendamentos
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState<
    "alphabetical" | "newest" | "oldest"
  >("newest");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [diasExibidos, setDiasExibidos] = useState(7); // Começa mostrando 7 dias

  // Compara uma data selecionada com a dataFormatada do agendamento
  const datasIguais = (data1: Date | null, data2: string): boolean => {
    if (!data1) return false;
    // Formata a data selecionada para comparar com dataFormatada do contexto
    const dia = String(data1.getDate()).padStart(2, "0");
    const mes = String(data1.getMonth() + 1).padStart(2, "0");
    const ano = data1.getFullYear();
    const dataSelecionadaFormatada = `${dia}/${mes}/${ano}`;
    return dataSelecionadaFormatada === data2;
  };

  // Filtra os agendamentos por nome, id ou data selecionada
  const filteredAgendamentos = agendamentos.filter((agendamento) => {
    const matchesSearch =
      agendamento.cliente.nome
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      agendamento.id.toLowerCase().includes(searchText.toLowerCase());

    const matchesDate = selectedDate
      ? datasIguais(selectedDate, agendamento.dataFormatada) // Usa dataFormatada aqui
      : true;

    return matchesSearch && matchesDate;
  })
  // atualiza a data selecionada
  const handleDateSelect = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const selected = new Date(year, month - 1, day); // mês começa em 0
    selected.setHours(0, 0, 0, 0); // Garante hora zerada
    setSelectedDate(selected);
    setShowDatePicker(false);
  };  

  // Altera a ordenação entre newest, oldest e alphabetical
  const handleSortPress = () => {
    setSortOption((prev) => {
      if (prev === "newest") return "oldest";
      if (prev === "oldest") return "alphabetical";
      return "newest";
    });
  };

  // Reseta os filtros
  const clearAllFilters = () => {
    setSearchText("");
    setSortOption("newest");
    setSelectedDate(null);
  };

  // Função para organizar os agendamentos com suporte aos filtros
  const organizarAgendamentosPorDia = (
    agendamentos: any[],
    sortOption: string
  ) => {
    // Primeiro a ordenação conforme o filtro selecionado
    const ordenados = [...agendamentos].sort((a, b) => {
      if (sortOption === "alphabetical") {
        return a.cliente.nome.localeCompare(b.cliente.nome);
      } else {
        // Para "newest" ou "oldest", ordena por data+horário
        const dataComparison = a.data.localeCompare(b.data);
        if (dataComparison !== 0) {
          return sortOption === "newest" ? -dataComparison : dataComparison;
        }
        // Se for o mesmo dia, ordena pelo horário
        return sortOption === "newest"
          ? b.horario.localeCompare(a.horario)
          : a.horario.localeCompare(b.horario);
      }
    });

    // Depois agrupa por dia
    return ordenados.reduce((acc, agendamento) => {
      const dataFormatada = agendamento.dataFormatada;
      if (!acc[dataFormatada]) {
        acc[dataFormatada] = [];
      }
      acc[dataFormatada].push(agendamento);
      return acc;
    }, {});
  };
  // organiza os agendamentos conforme os filtros aplicados
  const agendamentosOrganizados = organizarAgendamentosPorDia(
    filteredAgendamentos,
    sortOption
  );

  // Ordena os dias conforme o filtro selecionado
  const dias = Object.keys(agendamentosOrganizados).sort((a, b) => {
    const [diaA, mesA, anoA] = a.split("/").map(Number);
    const [diaB, mesB, anoB] = b.split("/").map(Number);

    if (sortOption === "alphabetical") {
      return (
        new Date(anoB, mesB - 1, diaB).getTime() -
        new Date(anoA, mesA - 1, diaA).getTime()
      );
    } else {
      // Para newest/oldest, ordena os dias conforme o filtro
      return sortOption === "newest"
        ? new Date(anoB, mesB - 1, diaB).getTime() -
            new Date(anoA, mesA - 1, diaA).getTime()
        : new Date(anoA, mesA - 1, diaA).getTime() -
            new Date(anoB, mesB - 1, diaB).getTime();
    }
  });
  const hasFilters = Boolean(
    searchText || sortOption !== "newest" || selectedDate
  );

  // Ajuste na renderização dos dias
  const diasParaExibir = dias.slice(0, diasExibidos);
  const haMaisDiasParaMostrar = dias.length > diasExibidos;

  // Função para carregar mais dias
  const mostrarMaisDias = () => {
    setDiasExibidos((prev) => prev + 7); // Mostra mais 7 dias
  };

  //cor do texto da data conforme o tema
  const textDataColor = useThemeColor({ light: "#333", dark: "#fff" }, "text");

  // Estado de carregamento
  if (loading && agendamentos.length === 0) {
    return <ThemedLoadingIndicator message="Carregando Agendamentos..." />;
  }
  //vazio
  if (agendamentos.length === 0) {
    return <AgendamentoEmpty />;
  }

  // Componente para quando a lista está vazia
  const EmptyListComponent = () => (
    <View style={[styles.centerContainer, { flex: 1 }]}>
      <ThemedText style={styles.emptyMessage}>
        {searchText
          ? `Nenhum agendamento encontrado para "${searchText}"`
          : selectedDate
          ? `Nenhum agendamento encontrado para ${selectedDate.toLocaleDateString(
              "pt-BR"
            )}`
          : "Nenhum agendamento encontrado"}
      </ThemedText>
    </View>
  );
  //renderizaçao do componente principal
  return (
    <ThemedView style={styles.container}>
      {/* Barra de busca */}
      <ThemedInput
        value={searchText}
        placeholder={"Buscar por ID ou nome do cliente"}
        onChangeText={setSearchText}
        type="outlined"
        icon={<Ionicons name="search" size={20} color="gray" />}
      />

      {/* Componente de Filtros */}
      <FiltrosAgendamento
        selectedDate={selectedDate}
        sortOption={sortOption}
        hasFilters={hasFilters}
        onDatePress={() => setShowDatePicker(true)}
        onSortPress={handleSortPress}
        onClearFilters={clearAllFilters}
      />
      {/* modal com o calendario tematizado para escolha da data para filtrro */}
      <Modal
        visible={showDatePicker}
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Selecione a data desejada
            </ThemedText>
            <Calendario
                onDayPress={(day) => {
                  handleDateSelect(day.dateString);
                }}
            />

            <ThemedButton
              title="Fechar"
              onPress={() => {
                setShowDatePicker(false);
              }}
              style={styles.modalButton}
            />
          </ThemedView>
        </View>
      </Modal>

      {/* Lista de agendamentos organizada por dia mais comentada por conta da quandtidade de props passadas e conplexidade */}
      <FlatList
        // Dados a serem renderizados: lista de dias
        data={diasParaExibir}
        // Função que retorna a chave única de cada item (neste caso, o próprio dia)
        keyExtractor={(dia) => dia}
        // Como renderizar cada item (dia e seus respectivos agendamentos)
        renderItem={({ item: dia }) => (
          <View style={styles.diaContainer}>
            {/* Título do dia */}
            <ThemedText style={[styles.diaHeader, { color: textDataColor }]}>
              {dia}
            </ThemedText>

            {/* Lista de agendamentos do dia atual */}
            {agendamentosOrganizados[dia].map((agendamento: any) => (
              <AgendamentoCard
                key={agendamento.id}
                agendamento={agendamento}
                // Define o agendamento selecionado ao pressionar
                onPress={() => setAgendamentoSelecionado(agendamento)}
              />
            ))}
          </View>
        )}
        // Indica se a lista está sendo atualizada (para exibir loading)
        refreshing={loading}
        // Função chamada ao puxar para atualizar a lista
        onRefresh={loadAgendamentos}
        // Esconde a barra de rolagem vertical
        showsVerticalScrollIndicator={false}
        // Estilo aplicado ao container da lista, dependendo se há ou não itens
        contentContainerStyle={
          filteredAgendamentos.length === 0
            ? styles.emptyListContent // quando a lista está vazia
            : styles.listContent // quando há agendamentos
        }
        // Componente exibido quando não há itens na lista
        ListEmptyComponent={<EmptyListComponent />}
        // Componente exibido no final da lista (botão para mostrar mais dias)
        ListFooterComponent={
          haMaisDiasParaMostrar ? (
            <ThemedButton
              title="Mostrar mais dias"
              onPress={mostrarMaisDias}
              style={styles.mostrarMaisButton}
            />
          ) : null
        }
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    overflow: "hidden",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 2,
    marginBottom: 0,
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
  diaContainer: {
    marginBottom: 16,
  },
  diaHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  mostrarMaisButton: {
    margin: 16,
    alignSelf: "center",
  },
});
