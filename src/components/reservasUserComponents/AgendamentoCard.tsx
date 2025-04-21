import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { AgendamentoUser } from "../../context/AgendamentosUserContext";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Interface que define as propriedades do componente AgendamentoCard
interface AgendamentoCardProps {
  agendamento: AgendamentoUser; // Dados do agendamento
  onPress: () => void; // Função chamada ao pressionar o card
  lightColor?: string; // Cor para tema claro (opcional)
  darkColor?: string; // Cor para tema escuro (opcional)
  showDelete?: boolean; // Mostrar botão de deletar? (opcional)
  onDelete?: () => void; // Função chamada ao deletar (opcional)
}

export const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  agendamento,
  onPress,
  lightColor,
  darkColor,
  showDelete = false, // Valor padrão para showDelete
  onDelete,
}) => {
  // Cores personalizadas para o card de acordo com o tema
  const cardBackground = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundCard"
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const secondaryTextColor = useThemeColor(
    { light: "#666", dark: "#a3a3a3" },
    "text"
  );
  const badgetColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "badget"
  );
  const textBadgetColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textBadget"
  );

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        {/* Nome do serviço com limite de 2 linhas */}
        <ThemedText
          type="subtitle"
          style={[styles.serviceName, { color: textColor }]}
          numberOfLines={2}
        >
          {agendamento.servico.nome}
        </ThemedText>

        <View style={styles.headerRight}>
          <View style={[styles.horarioBadge, { backgroundColor: badgetColor }]}>
            <ThemedText
              style={[styles.horarioBadgeText, { color: textBadgetColor }]}
            >
              {agendamento.horario}
            </ThemedText>
          </View>
          {/* Botão de deletar (condicional) */}
          {showDelete && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // Evita que o onPress do card seja acionado
                onDelete?.(); // Chamada opcional para função de deletar
              }}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color={"red"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.cardDetail}>
        <Ionicons name="business-outline" size={16} style={styles.icon} />
        <ThemedText
          style={[styles.detailText, { color: secondaryTextColor }]}
          numberOfLines={1}
        >
          {agendamento.servico.empresa.nomeEmpresa}
        </ThemedText>
      </View>

      <View style={styles.cardDetail}>
        <Ionicons name="calendar-outline" size={16} style={styles.icon} />
        <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
          {agendamento.dataFormatada}
        </ThemedText>
      </View>

      <View style={styles.cardDetail}>
        <Ionicons name="cash-outline" size={16} style={styles.icon} />
        <ThemedText style={[styles.detailText, { color: secondaryTextColor }]}>
          {agendamento.servico.custo.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    flexWrap: "wrap",
    maxWidth: "60%",
  },
  cardDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
    color: "#666",
  },
  detailText: {
    fontSize: 14,
  },
  horarioBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  horarioBadgeText: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 4,
  },
});

export default AgendamentoCard;
