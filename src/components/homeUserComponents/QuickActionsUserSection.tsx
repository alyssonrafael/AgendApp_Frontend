import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { Link } from "expo-router";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// seçao de açoes rapidas da home
const QuickActionsSection = () => {
  // cores personalizadas para os temas
  const backgroundCard = useThemeColor(
    { light: "#f5f5f5", dark: "#1e1e1e" },
    "backgroundCard"
  );
  return (
    <View style={[styles.section, { backgroundColor: backgroundCard }]}>
      <ThemedText type="subtitle">Navegação Rápida</ThemedText>
      <View style={styles.actionsContainer}>
        {/* o link e usado dessa forma para conseguir lidar com as rotas profundas acessadas e o asChild indica que ele esta em um pressable */}
        <Link href="/(telasUsers)/(agendamento)" asChild withAnchor>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-outline" size={22} color={"white"} />
            <ThemedText style={styles.actionButtonText}>
              Novo Agendamento
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/(telasUsers)/(reservas)/todasReservas" asChild withAnchor>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={22} color={"white"} />
            <ThemedText style={styles.actionButtonText}>
              Todas as reservas
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/(telasUsers)/(maisOpcoes)/editarPerfil" asChild withAnchor>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={22} color={"white"} />
            <ThemedText style={styles.actionButtonText}>
              Editar Perfil
            </ThemedText>
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
