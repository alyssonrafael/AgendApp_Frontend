import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRef } from "react";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { useEmpresa } from "@/src/context/EmpresaContext";
import { useAgendamentos } from "@/src/context/AgendamentosEmpresaContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { ModalDetalhes } from "@/src/components/horariosComponenents/ModalDetalhes";
import WelcomeSection from "@/src/components/homeEmpresaComponents/WelcomeSection";
import QuickActionsSection from "@/src/components/homeEmpresaComponents/QuickActionsSection";
import UpcomingAppointmentsSection from "@/src/components/homeEmpresaComponents/UpcommingAppointmentsSection";

export default function EmpresasHomeScreen() {
  // estados e funçoes vindos do contexto com algumas informações
  const { empresa } = useEmpresa();
  const { agendamentos, setAgendamentoSelecionado, loadAgendamentos, loading } =
    useAgendamentos();
  // controle para o scroll para o topo
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  // cores personalizadas para os temas
  const backgroundCard = useThemeColor(
    { light: "#f5f5f5", dark: "#1e1e1e" },
    "backgroundCard"
  );

  const secondaryTextCard = useThemeColor(
    { light: "#1e1e1e", dark: "#ccc" },
    "backgroundCard"
  );

  // Função para lidar com o refresh
  const handleRefresh = () => {
    loadAgendamentos();
  };

  // Filtrar agendamentos de hoje
  const hoje = new Date().toISOString().split("T")[0];
  const agendamentosHoje = agendamentos.filter(
    (ag) => ag.data.split("T")[0] === hoje
  ).length;

  // Filtrar agendamentos deste mês
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const agendamentosMes = agendamentos.filter((ag) => {
    const dataAg = new Date(ag.data);
    return dataAg.getMonth() === mesAtual && dataAg.getFullYear() === anoAtual;
  }).length;

  // Calcular faturamento
  const calcularFaturamento = (periodo: "dia" | "mes") => {
    const ags =
      periodo === "dia"
        ? agendamentos.filter((ag) => ag.data.split("T")[0] === hoje)
        : agendamentos.filter((ag) => {
            const dataAg = new Date(ag.data);
            return (
              dataAg.getMonth() === mesAtual &&
              dataAg.getFullYear() === anoAtual
            );
          });

    return ags.reduce((total, ag) => total + (ag.servico.custo || 0), 0);
  };

  const faturamentoHoje = calcularFaturamento("dia");
  const faturamentoMes = calcularFaturamento("mes");

  // Formatar para moeda brasileira
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Obter os 4 próximos agendamentos considerando data e horário
  const obterProximosAgendamentos = () => {
    const agora = new Date();
    return agendamentos
      .map((ag) => {
        // Combina a data ISO com o horário
        const dataISO = ag.data.split("T")[0]; // Pega apenas a parte da data
        const dataCompleta = new Date(`${dataISO}T${ag.horario}:00`);

        return { ...ag, dataCompleta };
      })
      .filter((ag) => ag.dataCompleta >= agora)
      .sort((a, b) => a.dataCompleta.getTime() - b.dataCompleta.getTime())
      .slice(0, 4)
      .map((ag) => {
        const { dataCompleta, ...rest } = ag;
        return rest;
      });
  };
  // salva os proximos agendamento em uma variavel a parte
  const proximosAgendamentos = obterProximosAgendamentos();

  return (
    <ThemedView style={styles.container}>
      {/* scroll com configuraçoes para melhor usabilidade e funçao de refresh */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* Seção 1: Bem-vindo */}
        <WelcomeSection
          backgroundCard={backgroundCard}
          secondaryTextCard={secondaryTextCard}
          empresa={empresa}
        />

        {/* Seção 2: Métricas do Dia */}
        <View style={[styles.section, { backgroundColor: backgroundCard }]}>
          <ThemedText type="subtitle">Métricas do Dia</ThemedText>
          <View style={styles.metricsContainer}>
            <View style={[styles.metricCard]}>
              <Ionicons name="calendar-outline" size={22} color={"#007BFF"} />

              <ThemedText style={styles.metricValue}>
                {agendamentosHoje}
              </ThemedText>
              <ThemedText
                style={[styles.metricLabel, { color: secondaryTextCard }]}
              >
                Agendamentos
              </ThemedText>
            </View>
            <View style={[styles.metricCard]}>
              <Ionicons name="cash-outline" size={22} color={"#FF9800"} />
              <ThemedText style={styles.metricValue}>
                {formatarMoeda(faturamentoHoje)}
              </ThemedText>
              <ThemedText
                style={[styles.metricLabel, { color: secondaryTextCard }]}
              >
                Faturamento
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Seção 3: Métricas do Mês */}
        <View style={[styles.section, { backgroundColor: backgroundCard }]}>
          <ThemedText type="subtitle">Métricas do Mês</ThemedText>
          <ThemedText
            style={{ fontSize: 10, color: secondaryTextCard, lineHeight: 12 }}
          >
            A metrica do mes inclui todos os agendamentos marcados do mês
            Podendo variar em caso de cancelamentos.
          </ThemedText>
          <View style={styles.metricsContainer}>
            <View style={[styles.metricCard]}>
              <Ionicons name="calendar-outline" size={22} color={"#007BFF"} />
              <ThemedText style={styles.metricValue}>
                {agendamentosMes}
              </ThemedText>
              <ThemedText
                style={[styles.metricLabel, { color: secondaryTextCard }]}
              >
                Agendamentos
              </ThemedText>
            </View>
            <View style={[styles.metricCard]}>
              <Ionicons name="cash-outline" size={22} color={"#FF9800"} />
              <ThemedText style={styles.metricValue}>
                {formatarMoeda(faturamentoMes)}
              </ThemedText>
              <ThemedText
                style={[styles.metricLabel, { color: secondaryTextCard }]}
              >
                Faturamento
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Seção 4: Navegação rápida */}
        <QuickActionsSection backgroundCard={backgroundCard} />

        {/* Seção 5: Próximos Agendamentos */}
        <UpcomingAppointmentsSection
          proximosAgendamentos={proximosAgendamentos}
          loading={loading}
          handleRefresh={handleRefresh}
          setAgendamentoSelecionado={setAgendamentoSelecionado}
        />

        {/* botao para voltar ao topo da pagina */}
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <Ionicons name="arrow-up" size={20} color="#007BFF" />
          <ThemedText style={styles.scrollToTopText}>Voltar ao topo</ThemedText>
        </TouchableOpacity>
        {/* modal de detalhes ao clicar em um agendamento */}
        <ModalDetalhes />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  scrollContainer: {
    padding: 18,
    paddingBottom: 32,
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
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  metricCard: {
    width: "48%",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  metricLabel: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
});
