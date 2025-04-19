import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { Link } from "expo-router";

// seçao de açoes rapidas da dashboard (home empresa)
const QuickActionsSection = ({
  backgroundCard, //recebe a cor de fundo do cartao por props
}: {
  backgroundCard: string;
}) => {
  return (
    <View style={[styles.section, { backgroundColor: backgroundCard }]}>
      <ThemedText type="subtitle">Navegação Rápida</ThemedText>
      <View style={styles.actionsContainer}>
        {/* o link e usado dessa forma para conseguir lidar com as rotas profundas acessadas e o asChild indica que ele esta em um pressable */}
        <Link
          href="/(telasEmpresas)/(servicos)/cadastroServico"
          asChild
          withAnchor
        >
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-outline" size={22} color={"white"} />
            <ThemedText style={styles.actionButtonText}>
              Novo Serviço
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <Link
          href="/(telasEmpresas)/(horarios)/agendamentosDoDia"
          asChild
          withAnchor
        >
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={22} color={"white"} />
            <ThemedText style={styles.actionButtonText}>
              Agendamentos do dia
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <Link
          href="/(telasEmpresas)/(maisOpcoes)/editarPerfil"
          asChild
          withAnchor
        >
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={22} color={"white"} />
            <ThemedText style={styles.actionButtonText}>
              Editar Perfil
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <Link
          href="/(telasEmpresas)/(maisOpcoes)/relatorios"
          asChild
          withAnchor
        >
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bar-chart-outline" size={22} color={"white"} />
            <ThemedText style={styles.actionButtonText}>Relatórios</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default QuickActionsSection;

const styles = StyleSheet.create({
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
  actionsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
