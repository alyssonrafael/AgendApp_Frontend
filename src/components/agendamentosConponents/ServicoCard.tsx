import { TouchableOpacity, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/src/components/ThemedText";
import { useThemeColor } from "@/src/hooks/useThemeColor";
// props recebidas para montar o card de serviço
interface ServicoCardProps {
  servico: {
    id: string;
    nome: string;
    descricao: string | null;
    custo: number;
    duracao: string;
  };
  lightColor?: string;
  darkColor?: string;
}

export const ServicoCard: React.FC<ServicoCardProps> = ({
  darkColor,
  lightColor,
  servico,
}) => {
  // cores personalizadas para os temas
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

  return (
    // o card e clicavel e ao precionar e redirecionado para detalhes agendamento com o serviçoid passado no paramentro
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={() =>
        router.push({
          pathname: "/(telasUsers)/(agendamento)/detalhesAgendamento",
          params: { servicoId: servico.id },
        })
      }
    >
      <View style={styles.infoContainer}>
        <ThemedText style={[styles.nome, { color: textColor }]}>
          {servico.nome}
        </ThemedText>
        <ThemedText
          style={[styles.descricao, { color: secondaryTextColor }]}
          numberOfLines={2}
        >
          {servico.descricao || "Serviço sem descrição"}
        </ThemedText>
      </View>
      <View style={styles.precoContainer}>
        <ThemedText style={styles.preco}>
          R$ {servico.custo.toFixed(2)}
        </ThemedText>
        <ThemedText style={[styles.duracao, { color: secondaryTextColor }]}>
          {servico.duracao} min
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
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
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  descricao: {
    fontSize: 14,
  },
  precoContainer: {
    alignItems: "flex-end",
  },
  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  duracao: {
    fontSize: 14,
    marginTop: 4,
  },
});
