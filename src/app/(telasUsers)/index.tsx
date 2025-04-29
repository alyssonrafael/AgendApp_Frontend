// HomeScreen.tsx
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useMemo, useRef } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  AgendamentoUser,
  useAgendamentoUser,
} from "@/src/context/AgendamentosUserContext";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import AgendamentoCard from "@/src/components/reservasUserComponents/AgendamentoCard";
import Calendario from "@/src/components/homeUserComponents/Calendario";
import HeaderHome from "@/src/components/homeUserComponents/HeaderHome";
import ModalAgendamentoDetalhes from "@/src/components/reservasUserComponents/ModalAgendamentoDetalhes";
import ModalAgendamentosDia from "@/src/components/homeUserComponents/ModalAgendamentosDia";
import QuickActionsSection from "@/src/components/homeUserComponents/QuickActionsUserSection";

export default function UsersHomeScreen() {
  // controle para o scroll para o topo
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  // dados do contexto de agendamentos do usuario
  const {
    agendamentos,
    loading,
    setDataSelecionada,
    setAgendamentoSelecionado,
    loadAgendamentos,
  } = useAgendamentoUser();

  // datas que contem algum agendamento tem a bolinha azul
  const markedDates = agendamentos.reduce<Record<string, any>>(
    (acc, agendamento) => {
      const dateStr = agendamento.dataObj.toISOString().split("T")[0];
      acc[dateStr] = {
        marked: true,
        dotColor: "#007AFF",
        dotStyle: {
          width: 15,
          height: 15,
          borderRadius: 4,
          marginTop: 2,
        },
      };
      return acc;
    },
    {}
  );

  // funçao que seta a data quando clica no calendario
  const handleDayPress = (day: { dateString: string }) => {
    setDataSelecionada(day.dateString);
  };
  // funçao que seta o gendamento selecionado no card para abrir o modal de detalhes do agendamento
  const handleCardPress = (agendamento: AgendamentoUser) => {
    setAgendamentoSelecionado(agendamento);
  };

  // Usa o hook useMemo para memoizar/otimizar o cálculo dos próximos agendamentos
  // Isso evita recálculos desnecessários enquanto os agendamentos não mudarem
  const proximosAgendamentos = useMemo(
    () =>
      agendamentos
        // Filtra apenas agendamentos futuros ou do dia atual
        .filter((a) => new Date(a.dataObj) >= new Date())
        // Ordena os agendamentos por data (do mais próximo para o mais distante)
        .sort(
          (a, b) =>
            new Date(a.dataObj).getTime() - new Date(b.dataObj).getTime()
        )
        // Pega apenas os 3 primeiros agendamentos (os mais próximos)
        .slice(0, 3),
    // Array de dependências - só recalcula quando o array de agendamentos mudar
    [agendamentos]
  );

  // indicativco de loading enquanto estiver carregando
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedLoadingIndicator message="Carregando..." />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadAgendamentos} />
        }
      >
        {/* header da home */}
        <HeaderHome />
        {/* calendario interativo */}
        <Calendario markedDates={markedDates} onDayPress={handleDayPress} />
        {/* açoes rapidas */}
        <QuickActionsSection />
        {/* Próximos Agendamentos */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Agendamentos mais próximos</ThemedText>
          {/* faz o map e exibe o card dos agendamentos proxinmos se nao houver exibe o indicativo */}
          {proximosAgendamentos.length > 0 ? (
            proximosAgendamentos.map((agendamento) => (
              <AgendamentoCard
                key={agendamento.id}
                agendamento={agendamento}
                onPress={() => handleCardPress(agendamento)}
                showDelete={false}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="event-available" size={40} color="#ccc" />
              <ThemedText style={styles.emptyText}>
                Nenhum agendamento futuro
              </ThemedText>
            </View>
          )}
        </View>
        {/* botao para voltar ao topo da pagina */}
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <Ionicons name="arrow-up" size={20} color="#007BFF" />
          <ThemedText style={styles.scrollToTopText}>Voltar ao topo</ThemedText>
        </TouchableOpacity>
      </ScrollView>
      {/* modais para detalhes de agendamentos */}
      {/* modal com todos os agendamentos do dia selecionado */}
      <ModalAgendamentosDia />
      {/* modal com o agendamento selecionado especifico e seus detalhes */}
      <ModalAgendamentoDetalhes />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
  },
  section: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 10,
  },
  scrollToTopButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 8,
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
  scrollToTopText: {
    marginLeft: 8,
    color: "#007BFF",
    fontWeight: "bold",
  },
});
