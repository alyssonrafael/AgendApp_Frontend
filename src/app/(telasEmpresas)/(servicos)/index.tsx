import { useState } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedButton } from "@/src/components/ThemedButton";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import { ServiceCard } from "@/src/components/servicosComponents/ServiceCard";
import { ServiceEmpty } from "@/src/components/servicosComponents/ServiceEmpty";
import { StatusFilter } from "@/src/components/servicosComponents/StatusFilter";
import { SortFilter } from "@/src/components/servicosComponents/SortFilter";
import { useMessage } from "@/src/context/MessageContext";
import { useEmpresaServices } from "../../../context/EmpresaServiceContext";

// tipos do filtro por ordenação
type SortOption = "alphabetical" | "newest" | "oldest";

export default function ServicosScreen() {
  const [searchText, setSearchText] = useState(""); //estado que armazena o texto pesquisado
  const [showInactive, setShowInactive] = useState(false); // estado que armazena se o inactive deve ou nao ser exibido
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical"); //estado que armazena o tipo do filtro por oedenação

  const { services, loading, loadServices, toggleServiceStatus } =
    useEmpresaServices(); //funções e estados vindo do contexto
  const { showMessage } = useMessage(); //estado para mostrar a mensagem

  // Filtros e ordenação
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.nome
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = showInactive ? !service.ativo : service.ativo;
    return matchesSearch && matchesStatus;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortOption) {
      case "alphabetical":
        return a.nome.localeCompare(b.nome);
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  // contadores de serviços
  const inactiveCount = services.filter((service) => !service.ativo).length;
  const activeCount = services.filter((service) => service.ativo).length;

  // Handlers que chamam a função de alterar status
  const handleStatusToggle = async (serviceId: string, activate: boolean) => {
    const success = await toggleServiceStatus(serviceId, activate);
    showMessage(
      success ? "success" : "danger",
      success
        ? `Serviço ${activate ? "ativado" : "inativado"} com sucesso!`
        : `Falha ao ${activate ? "ativar" : "inativar"} serviço`
    );
  };

  // Estados de renderização
  //Carregando
  if (loading && services.length === 0) {
    return <ThemedLoadingIndicator message="Carregando Serviços..." />;
  }
  //vazio
  if (services.length === 0) {
    return <ServiceEmpty />;
  }
  // Sem resultado para pesquisa feita
  if (filteredServices.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedInput
          value={searchText}
          placeholder={`Buscar serviços ${
            showInactive ? "inativos" : "ativos"
          }...`}
          onChangeText={setSearchText}
          type="outlined"
          icon={<Ionicons name="search" size={20} color="gray" />}
        />

        <StatusFilter
          showInactive={showInactive}
          inactiveCount={inactiveCount}
          activeCount={activeCount}
          onFilterChange={setShowInactive}
        />

        <View style={[styles.centerContainer, { flex: 1 }]}>
          <ThemedText style={styles.emptyMessage}>
            {searchText
              ? `Nenhum serviço ${
                  showInactive ? "inativo" : "ativo"
                } encontrado para "${searchText}"`
              : `Nenhum serviço ${
                  showInactive ? "inativo" : "ativo"
                } encontrado`}
          </ThemedText>
        </View>

        <ThemedButton
          title="Cadastrar novo serviço"
          icon={<AntDesign name="pluscircleo" size={20} color="#FFF" />}
          onPress={() =>
            router.push("/(telasEmpresas)/(servicos)/cadastroServico")
          }
        />
      </ThemedView>
    );
  }
  // Renderização principal
  return (
    <ThemedView style={styles.container}>
      {/* input de busca por nome */}
      <ThemedInput
        value={searchText}
        placeholder={`Buscar serviços ${
          showInactive ? "inativos" : "ativos"
        }...`}
        onChangeText={setSearchText}
        type="outlined"
        icon={<Ionicons name="search" size={20} color="gray" />}
      />
      {/* filtro por estado */}
      <StatusFilter
        showInactive={showInactive}
        inactiveCount={inactiveCount}
        activeCount={activeCount}
        onFilterChange={setShowInactive}
      />
      {/* filtro por ordenação */}
      <SortFilter
        sortOption={sortOption}
        onSortChange={() => {
          setSortOption((prev) => {
            if (prev === "alphabetical") return "newest";
            if (prev === "newest") return "oldest";
            return "alphabetical";
          });
        }}
      />
      {/* FlatList mais comentado por ter muitos parametros */}
      <FlatList
        // Array de dados já filtrados e ordenados
        data={sortedServices}
        // Função que renderiza cada item da lista
        renderItem={({ item }) => (
          <ServiceCard
            service={item} // Passa o objeto de serviço completo
            onDelete={() => handleStatusToggle(item.id, false)} // Ação para inativar
            onRestore={() => handleStatusToggle(item.id, true)} // Ação para reativar
          />
        )}
        // Extrai chaves únicas para cada item (melhora performance)
        keyExtractor={(item) => item.id.toString()}
        // Estilos adicionais para o container de conteúdo
        contentContainerStyle={styles.listContent}
        // Estado de refresh (carregando dados)
        refreshing={loading}
        // Função chamada ao puxar para atualizar
        onRefresh={loadServices}
        // Esconde a barra de rolagem vertical
        showsVerticalScrollIndicator={false}
      />
      {/* botao que redireciona para página de cadastro de novo serviço */}
      <ThemedButton
        title="Cadastrar novo serviço"
        icon={<AntDesign name="pluscircleo" size={20} color="#FFF" />}
        onPress={() =>
          router.push("/(telasEmpresas)/(servicos)/cadastroServico")
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 16,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: "80%",
  },
});
