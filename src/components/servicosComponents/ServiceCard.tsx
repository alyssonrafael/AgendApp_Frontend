import {
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Easing,
} from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { useEffect, useRef, useState } from "react";
// inportaçao do tipo serviço
import { Service } from "@/src/context/EmpresaServiceContext";

type ServiceCardProps = {
  service: Service;
  lightColor?: string;
  darkColor?: string;
  onDelete: () => Promise<void>;
  onRestore: () => Promise<void>;
};

export const ServiceCard = ({
  service,
  lightColor,
  darkColor,
  onDelete,
  onRestore,
}: ServiceCardProps) => {
  // estado do loading para quando a handleAction que chama o delete e o restore e acionado
  const [isLoading, setIsLoading] = useState(false);

  // Cria uma referência para um valor animado inicializado em 0
  const spinAnimation = useRef(new Animated.Value(0)).current;

  // Efeito que gerencia a animação quando isLoading muda
  useEffect(() => {
    if (isLoading) {
      // Inicia animação em loop (roda continuamente)
      Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1, // Valor final da animação
          duration: 1000, // Duração de 1 segundo
          easing: Easing.linear, // Progressão linear
          useNativeDriver: true, // Aceleração por GPU (melhor performance)
        })
      ).start();
    } else {
      // Reseta a animação quando não está carregando
      spinAnimation.setValue(0);
    }
  }, [isLoading]); // Executa sempre que isLoading mudar

  // Mapeia o valor animado (0-1) para graus de rotação (0°-360°)
  const spin = spinAnimation.interpolate({
    inputRange: [0, 1], // Entrada: 0 a 1
    outputRange: ["0deg", "360deg"], // Saída: 0° a 360°
  });
  // funçao que chama as funçoes ansicronas e iniciam o loading do icone
  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      console.error("Erro na ação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cores personalizadas para o card
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
  const dangerColor = useThemeColor(
    { light: "#dc2626", dark: "#ef4444" },
    "text"
  );
  const successColor = useThemeColor(
    { light: "#16a34a", dark: "#22c55e" },
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
    <ThemedView style={[styles.card, { backgroundColor: cardBackground }]}>
      {/* ao clicar no card e direcionado para pagina de detalhes passando o id do serviço como parametro */}
      <TouchableOpacity
        style={styles.content}
        onPress={() =>
          router.push({
            pathname: "/(telasEmpresas)/(servicos)/detalheServico",
            params: { id: service.id },
          })
        }
      >
        <View style={styles.textContainer}>
          <ThemedText
            style={[styles.title, { color: textColor }]}
            type="defaultSemiBold"
            numberOfLines={2}
          >
            {service.nome}
          </ThemedText>
        </View>

        <ThemedText
          style={[styles.description, { color: secondaryTextColor }]}
          type="default"
          numberOfLines={1}
        >
          {service.descricao}
        </ThemedText>
      </TouchableOpacity>
      {/* Se o serviço estiver inativo mostra o Badge */}
      {!service.ativo && (
        <View style={[styles.inactiveBadge, { backgroundColor: badgetColor }]}>
          <ThemedText
            style={[styles.inactiveBadgeText, { color: textBadgetColor }]}
          >
            Inativo
          </ThemedText>
        </View>
      )}
      {/* icone do pencil que direciona para pagina de edição passando o id como parametro */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            router.push({
              pathname: "/(telasEmpresas)/(servicos)/edicaoServico",
              params: { id: service.id },
            })
          }
        >
          <Ionicons name="pencil-outline" size={20} color="#007AFF" />
        </TouchableOpacity>

        {/* Renderização condicional dos botões de ação */}
        {isLoading ? (
          // Mostra ícone de loading animado (spinner) quando carregando
          <View style={styles.actionButton}>
            {/* animaçao de girar passada aqui */}
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons
                name="refresh-circle-outline"
                size={20}
                color={service.ativo ? dangerColor : successColor} // Cor condicional
              />
            </Animated.View>
          </View>
        ) : service.ativo ? (
          // Botão de lixeira (quando serviço está ativo)
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAction(onDelete)}
            disabled={isLoading} // Desabilita durante loading
          >
            <Ionicons name="trash-outline" size={20} color={dangerColor} />
          </TouchableOpacity>
        ) : (
          // Botão de reativação (quando serviço está inativo)
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAction(onRestore)}
            disabled={isLoading} // Desabilita durante loading
          >
            <Ionicons
              name="refresh-circle-outline"
              size={20}
              color={successColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    marginRight: 8,
  },
  inactiveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactiveBadgeText: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});
