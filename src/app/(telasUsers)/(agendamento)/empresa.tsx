import { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Text,
} from "react-native";
import api, { apiImages } from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ServicoCard } from "@/src/components/agendamentosConponents/ServicoCard";
import { useMessage } from "@/src/context/MessageContext";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
// Interfaces que definem a estrutura dos dados
interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  custo: number;
  duracao: string;
}

interface Empresa {
  id: string;
  nomeEmpresa: string;
  image?: string | null; // URL da imagem (opcional)
  description?: string | null; // Descrição da empresa (opcional)
  address?: string | null; // Endereço (opcional)
  phoneNumber?: string | null; // Telefone (opcional)
  email?: string | null; // Email (opcional)
  createdAt: string; // Data de criação
  servicos: Servico[]; // Array de serviços oferecidos
}

export default function empresas() {
  // Estados do componente
  const { empresaId } = useLocalSearchParams(); // Obtém o ID da empresa da rota
  const [empresa, setEmpresa] = useState<Empresa>(); // Armazena os dados da empresa
  const [loading, setloading] = useState(false); //estado para controlar o loading
  const [searchTerm, setSearchTerm] = useState(""); // Controla o termo de busca
  const { showMessage } = useMessage(); //mensagem de feedback

  // Função para buscar os dados da empresa na API
  const fetchEmpresa = async () => {
    try {
      setloading(true);
      const token = await AsyncStorage.getItem("userToken"); // Obtém o token de autenticação
      const response = await api.get(`/companies/${empresaId}`, {
        headers: {
          Authorization: `${token}`, // Envia o token no cabeçalho
        },
      });
      setEmpresa(response.data); // Atualiza o estado com os dados da empresa
    } catch (error) {
      showMessage("danger", "Erro ao buscar empresa.");
    } finally {
      setloading(false);
    }
  };

  // Filtra os serviços baseado no termo de busca (otimizado com useMemo)
  const filteredServicos = useMemo(() => {
    if (!empresa || !empresa.servicos) return []; // Retorna vazio se não houver dados

    if (!searchTerm.trim()) return empresa.servicos; // Retorna todos se não houver busca

    const searchLower = searchTerm.toLowerCase(); // Normaliza o termo de busca

    // Filtra os serviços que correspondem ao termo no nome ou descrição
    return empresa.servicos.filter((servico) => {
      return (
        servico.nome.toLowerCase().includes(searchLower) ||
        (servico.descricao &&
          servico.descricao.toLowerCase().includes(searchLower))
      );
    });
  }, [empresa, searchTerm]); // Só recalcula quando empresa ou searchTerm mudam

  //Função para formatar a data para padrao br para exibiçao na tela
  const formatDisplayDate = (dataISO: string | undefined) => {
    if (dataISO === undefined) {
      return "Não encontrada";
    }
    const [year, month, day] = dataISO.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  // Efeito que busca os dados da empresa quando o componente monta ou o ID muda
  useEffect(() => {
    if (empresaId) {
      fetchEmpresa();
    }
  }, [empresaId]);

  // se a empresa estiver sendo carregada
  if (loading) {
    return (
      <ThemedView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ThemedLoadingIndicator message="Carregando Empresa..." />
      </ThemedView>
    );
  }

  if (!empresa) {
    return (
      <ThemedView style={styles.errorContainer}>
        {/* Ícone simples */}
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color="#ccc" 
          style={{marginBottom:16}}
        />
        {/* Mensagem única */}
        <ThemedText style={styles.errorText}>
          Erro ao carregar empresa, verifique sua conexão e tente novamente, se
          o erro persistir contate o suporte.
        </ThemedText>
        <ThemedText style={styles.errorText}>
          Lamentamos o incovenente.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção do cabeçalho com imagem/avatar e nome */}
        <View style={styles.header}>
          {empresa?.image ? ( // Mostra imagem se existir
            <Image
              source={{ uri: `${apiImages}${empresa.image}` }}
              style={styles.empresaImage}
            />
          ) : (
            // Mostra inicial do nome se não tiver imagem
            <View style={styles.circle}>
              <Text style={styles.initial}>
                {empresa?.nomeEmpresa?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
          <ThemedText type="title" style={styles.title}>
            {empresa?.nomeEmpresa}
          </ThemedText>
        </View>

        {/* Card com informações da empresa */}
        <ThemedView style={styles.infoCard}>
          {/* Linha de endereço */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <ThemedText style={styles.infoText}>
              {empresa?.address || "Empresa não tem endereço cadastrado"}
            </ThemedText>
          </View>

          {/* Linha de descrição */}
          <View style={styles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#666"
            />
            <ThemedText style={styles.infoText}>
              {empresa?.description || "Empresa não tem descrição cadastrada"}
            </ThemedText>
          </View>

          {/* Linha de telefone */}
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <ThemedText style={styles.infoText}>
              {empresa?.phoneNumber || "Empresa não tem telefone cadastrado"}
            </ThemedText>
          </View>

          {/* Linha de email */}
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <ThemedText style={styles.infoText}>
              {empresa?.email || "Empresa não tem e-mail cadastrado"}
            </ThemedText>
          </View>

          {/* Linha de criaçao */}
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoText}>
              No AgendApp desde: {formatDisplayDate(empresa?.createdAt)}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Seção de serviços */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Serviços Disponíveis
        </ThemedText>

        {/* Campo de busca de serviços */}
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <ThemedInput
              type="outlined"
              icon={<Ionicons name="search" size={18} color={"gray"} />}
              placeholder="Buscar por nome do serviço"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
          </View>
          {/* Botão para limpar a pesquisa (só aparece quando há texto) */}
          {searchTerm ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchTerm("")}
            >
              <Ionicons name="close-circle" size={18} color={"gray"} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Lista de serviços (filtrada) */}
        {filteredServicos.length ? (
          filteredServicos.map((servico) => (
            <ServicoCard key={servico.id} servico={servico} />
          ))
        ) : (
          // Mensagem quando não há serviços
          <ThemedView style={styles.noServices}>
            <ThemedText style={styles.noServicesText}>
              {searchTerm.trim()
                ? "Nenhum serviço encontrado para sua busca"
                : "Nenhum serviço disponível no momento"}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  empresaImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    fontSize: 40,
    color: "#fff",
  },
  noServices: {
    padding: 16,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  noServicesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  // caso de erro
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
});
