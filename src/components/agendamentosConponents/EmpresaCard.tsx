import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { apiImages } from "@/src/services/api";
import { ThemedText } from "@/src/components/ThemedText";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// props recebidas para montar o card da empresa
interface EmpresaCardProps {
  empresa: {
    id: string;
    nomeEmpresa: string;
    image?: string;
    description?: string;
    address?: string;
    phoneNumber?: string;
  };
  onPress?: () => void;
  lightColor?: string;
  darkColor?: string;
}

export const EmpresaCard: React.FC<EmpresaCardProps> = ({
  empresa,
  onPress,
  darkColor,
  lightColor,
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

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Imagem da empresa */}
      {empresa.image && (
        <Image
          source={{ uri: `${apiImages}${empresa.image}` }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      {/* se nao houver imagem exibe a primeira letra */}
      {!empresa.image && (
        <View style={styles.circle}>
          <Text style={styles.initial}>
            {empresa?.nomeEmpresa.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Informações da empresa */}
      <View style={styles.infoContainer}>
        <ThemedText type="subtitle" style={[styles.nome, { color: textColor }]}>
          {empresa.nomeEmpresa}
        </ThemedText>

        {empresa.description && (
          <ThemedText
            style={[styles.description, { color: secondaryTextColor }]}
            numberOfLines={1}
          >
            {empresa.description}
          </ThemedText>
        )}

        {empresa.address && (
          <View style={styles.metaContainer}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <ThemedText
              style={[styles.metaText, { color: secondaryTextColor }]}
              numberOfLines={1}
            >
              {empresa.address}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Ícone de navegação */}
      <MaterialIcons name="chevron-right" size={24} color="#666" />
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 14,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    fontSize: 40,
    color: "#fff",
  },
});
