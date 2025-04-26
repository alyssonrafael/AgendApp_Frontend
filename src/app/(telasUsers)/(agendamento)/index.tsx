import { useState, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import api from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMessage } from "@/src/context/MessageContext";
import { ThemedView } from "@/src/components/ThemedView";
import { EmpresaCard } from "@/src/components/agendamentosConponents/EmpresaCard";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedButton } from "@/src/components/ThemedButton";
import EmptyResults from "@/src/components/agendamentosConponents/EmptyResults";

//interface da empresa para essa pagina
interface Empresa {
  id: string;
  nomeEmpresa: string;
  image?: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
}
// definindo a quantidade base de empresas por pagina
const ITEMS_PER_PAGE = 10;

export default function EmpresasScreen() {
  // Estados importantes:
  const [allEmpresas, setAllEmpresas] = useState<Empresa[]>([]); // Todas as empresas carregadas da API
  const [displayedEmpresas, setDisplayedEmpresas] = useState<Empresa[]>([]); // Empresas atualmente exibidas (com paginação)
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca
  const [currentPage, setCurrentPage] = useState(1); // Paginação atual

  // Referências e animações:
  const flatListRef = useRef<FlatList>(null); // Referência para a FlatList (usada para scroll)
  const scrollY = useRef(new Animated.Value(0)).current; // Valor animado para acompanhar scroll

  const { showMessage } = useMessage(); //mensagem de feedback

  // Função principal para carregar empresas da API
  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get("/companies", {
        headers: {
          Authorization: `${token}`,
        },
      });

      // Ordenação especial:
      // Empresas com imagem aparecem primeiro
      // Dentro de cada grupo (com/sem imagem), ordena alfabeticamente
      const sortedEmpresas = response.data.sort((a: Empresa, b: Empresa) => {
        if ((a.image && b.image) || (!a.image && !b.image)) {
          return a.nomeEmpresa.localeCompare(b.nomeEmpresa);
        }
        return a.image ? -1 : 1;
      });

      setAllEmpresas(sortedEmpresas);
      setDisplayedEmpresas(sortedEmpresas.slice(0, ITEMS_PER_PAGE)); // Paginação inicial
    } catch (err) {
      showMessage("danger", "Erro ao carregar empresas");
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar empresas quando o componente monta
  useEffect(() => {
    fetchEmpresas();
  }, []);

  // Navegação para detalhes da empresa passando o id da empresa como parametro
  const handlePressEmpresa = (empresaId: string) => {
    router.push({
      pathname: "/(telasUsers)/(agendamento)/empresa",
      params: { empresaId },
    });
  };

  // Filtro de empresas baseado no termo de busca (useMemo para performance)
  const filteredEmpresas = useMemo(() => {
    const filtered = allEmpresas.filter((empresa) => {
      const searchLower = searchTerm.toLowerCase();
      return empresa.nomeEmpresa.toLowerCase().includes(searchLower);
    });

    setCurrentPage(1); // Reseta paginação ao buscar
    return filtered.slice(0, ITEMS_PER_PAGE * 1); // Mostra apenas primeira página dos resultados
  }, [allEmpresas, searchTerm]);

  // Carregar mais empresas (pagination)
  const loadMoreEmpresas = () => {
    const sourceData = searchTerm ? filteredEmpresas : allEmpresas;
    if (displayedEmpresas.length >= sourceData.length) return;

    const nextPage = currentPage + 1;
    const endIndex = nextPage * ITEMS_PER_PAGE;
    const newEmpresas = sourceData.slice(0, endIndex);

    setDisplayedEmpresas(newEmpresas);
    setCurrentPage(nextPage);
  };

  // Funções auxiliares para scroll
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Componente de rodapé dinâmico (mostra "carregar mais" ou "voltar ao topo")
  const renderFooter = () => {
    const sourceData = searchTerm ? filteredEmpresas : allEmpresas;
    const currentData = searchTerm ? filteredEmpresas : displayedEmpresas;

    const allItemsShown = currentData.length >= sourceData.length;
    const hasMore = !allItemsShown && sourceData.length > ITEMS_PER_PAGE;

    if (hasMore) {
      return <ThemedButton title="Mostrar mais" onPress={loadMoreEmpresas} />;
    } else if (allItemsShown && sourceData.length > ITEMS_PER_PAGE) {
      return (
        <ThemedButton
          title="Você chegou ao fim. Voltar ao topo"
          textStyle={{ fontSize: 14 }}
          onPress={scrollToTop}
        />
      );
    }
    return null;
  };

  // Tela de loading inicial
  if (loading && allEmpresas.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedLoadingIndicator message="Carregando empresas..." />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Área de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <ThemedInput
            type="outlined"
            icon={<Ionicons name="search" size={18} color={"gray"} />}
            placeholder="Buscar por nome da empresa."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>
        {/* Botão para limpar busca */}
        {searchTerm ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchTerm("")}
          >
            <Ionicons name="close-circle" size={18} color={"gray"} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Lista principal de empresas */}
      <FlatList
        ref={flatListRef}
        data={searchTerm ? filteredEmpresas : displayedEmpresas} // Dados dinâmicos (busca ou paginação)
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        onRefresh={() => {
          // Pull-to-refresh
          setCurrentPage(1);
          fetchEmpresas();
        }}
        renderItem={({ item }) => (
          <EmpresaCard
            empresa={item}
            onPress={() => handlePressEmpresa(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          // Componente quando não há resultados
          <EmptyResults
            searchTerm={searchTerm}
            onRetry={() => (searchTerm ? setSearchTerm("") : fetchEmpresas())}
            loading={loading}
          />
        }
        ListFooterComponent={renderFooter} // Rodapé dinâmico
        onScroll={Animated.event(
          // Animação de scroll
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Botão flutuante animado para voltar ao topo */}
      <Animated.View
        style={[
          styles.floatingButton,
          {
            opacity: scrollY.interpolate({
              inputRange: [100, 200],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [100, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={scrollToTop}>
          <Ionicons name="arrow-up-circle" size={48} color="#ccc" />
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingVertical: 16,
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
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 10,
  },
});
