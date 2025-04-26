import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Agendamento } from "@/src/context/AgendamentosEmpresaContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { AgendamentoCard } from "../horariosComponenents/AgendamentoCard";

// componente para renderizar os proximos agendamentos na dashboard (home da empresa)
const UpcomingAppointmentsSection = ({
  proximosAgendamentos, //recebe a lista de proximos agendamentos
  loading, //recebe um estado de loading
  handleRefresh, //recebe uma funçao de recarregar
  setAgendamentoSelecionado, //seta um agendamento como selecionado
}: {
  proximosAgendamentos: Agendamento[];
  loading: boolean;
  handleRefresh: () => void;
  setAgendamentoSelecionado: (agendamento: Agendamento) => void;
}) => (
  // header com o botao de refresh dos agendamentos
  <View style={{ marginBottom: 20, padding: 16 }}>
    <View style={styles.headerSection}>
      <ThemedText type="subtitle">Próximos Agendamentos ({proximosAgendamentos.length})</ThemedText>
      <TouchableOpacity
        onPress={handleRefresh}
        style={styles.reloadButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <Ionicons name="refresh" size={12} color="#007BFF" />
        )}
      </TouchableOpacity>
    </View>
    {/* faz o condicional caso nao haja agendamentos */}
    {loading && proximosAgendamentos.length === 0 ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    ) : proximosAgendamentos.length > 0 ? (
      <View style={styles.agendamentosContainer}>
        {proximosAgendamentos.map((agendamento) => (
          <AgendamentoCard
            key={agendamento.id}
            agendamento={agendamento}
            onPress={() => setAgendamentoSelecionado(agendamento)}
          />
        ))}
      </View>
    ) : (
      <ThemedText style={styles.semAgendamentos}>
        Nenhum agendamento futuro encontrado
      </ThemedText>
    )}
  </View>
);

export default UpcomingAppointmentsSection;

const styles = StyleSheet.create({
  agendamentosContainer: {
    marginTop: 12,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reloadButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
  loadingContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  semAgendamentos: {
    textAlign: "center",
    marginVertical: 16,
  },
});
