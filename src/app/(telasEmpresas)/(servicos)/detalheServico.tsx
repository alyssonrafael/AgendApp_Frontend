import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEmpresaServices } from "../../../context/EmpresaServiceContext";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import { ServiceNotFound } from "@/src/components/servicosComponents/ServiceNotFound";

export default function DetalheServico() {
  // recupera o id do parametro
  const { id } = useLocalSearchParams();
  //tras do contexto os serviços
  const { services, loading } = useEmpresaServices();
  //encontra o serviço que esta para ser exibido busca atraves do id
  const service = services.find((s) => s.id.toString() === id);

  // em caso de carregamento
  if (loading) {
    return <ThemedLoadingIndicator message="Carregando serviço..." />;
  }
  // em caso de não encontrar o serviço
  if (!service) {
    return <ServiceNotFound />;
  }

  // Funçao para formata a data para dd/mm/aaaa
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={{maxWidth:"80%"}}>
            <ThemedText style={styles.title}>{service.nome}</ThemedText>
            <ThemedText style={styles.subtitle}>
              ID: {service.id.toString().slice(0, 8)}...
            </ThemedText>
          </View>
          <TouchableOpacity
          // puxa a rota de edição passando o id do serviço como parametro para ser recuperado na tela de edição
            onPress={() =>
              router.push({
                pathname: "/(telasEmpresas)/(servicos)/edicaoServico",
                params: {
                  id: service.id,
                },
              })
            }
            style={styles.editButton}
          >
            <Ionicons name="pencil-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Descrição</ThemedText>
          <ScrollView
            style={styles.descriptionContainer}
            nestedScrollEnabled={true}
          >
            <ThemedText style={styles.description}>
              {service.descricao}
            </ThemedText>
          </ScrollView>
        </View>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preço</ThemedText>
          <ThemedText style={styles.description}>
            R$ {service.custo.toFixed(2).replace(".", ",")}
          </ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Duração</ThemedText>
          <ThemedText style={styles.description}>
            {/* exibe a duraçao em horas ou minutos */}
            {service.duracao >= 60
              ? `${Math.floor(service.duracao / 60)}h ${
                  service.duracao % 60
                }min`
              : `${service.duracao}min`}
          </ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Status</ThemedText>
          <ThemedText
            style={[
              styles.description,
              { color: service.ativo ? "#22c55e" : "#ef4444" },
            ]}
          >
            {service.ativo ? "Ativo" : "Inativo"}
          </ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Criado em</ThemedText>
          <ThemedText style={styles.description}>
            {formatDate(service.createdAt)}
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  editButton: {
    padding: 8,
    alignSelf: "flex-start",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  descriptionContainer: {
    maxHeight: 100,
    padding: 12,
  },
});
