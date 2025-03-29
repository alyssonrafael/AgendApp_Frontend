import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

//tipagem do serviço
export type Service = {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  duracao: number;
  custo: number;
  createdAt: number;
};
// tipo para os dados quando vao ser criados exportando para recuperar na tala de criaçao
type CreateServiceData = {
  nome: string;
  descricao: string;
  duracao: number;
  custo: number;
};

type ServiceContextType = {
  services: Service[];
  loading: boolean;
  loadServices: () => Promise<void>;
  createService: (data: CreateServiceData) => Promise<Service | null>;
  toggleServiceStatus: (id: string, activate: boolean) => Promise<boolean>;
  updateNome: (id: string, nome: string) => Promise<boolean>;
  updateDescricao: (id: string, descricao: string) => Promise<boolean>;
  updateDuracao: (id: string, duracao: number) => Promise<boolean>;
  updateCusto: (id: string, custo: number) => Promise<boolean>;
};

const EmpresaServiceContext = createContext<ServiceContextType | undefined>(
  undefined
);

export const EmpresaServiceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para carregar ou recarregar como um reload dos serviços da empresa logada
  const loadServices = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setServices([]);
        return;
      }

      const response = await api.get("/servicos/meus-servicos", {
        headers: { Authorization: `${token}` },
      });
      setServices(response.data);
    } catch (error: any) {
      // retorno pois nao ter nenhum serviço não e tecnicamente um erro enão somente retorna
      if (error.response?.status === 404) {
        return;
      } else {
        throw new Error("Erro ao buscar serviços da empres");
      }
    } finally {
      setLoading(false);
    }
  };

  //Funçao para criar um serviço
  const createService = async (
    data: CreateServiceData
  ): Promise<Service | null> => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await api.post("/servicos", data, {
        headers: { Authorization: `${token}` },
      });

      const newService = response.data;

      // Atualiza o estado local adicionando o novo serviço sem ser preciso fazer uma nova chamada para recarregar
      setServices((prevServices) => [...prevServices, newService]);
      return newService;
    } catch (error: any) {
      //tratamento de erros que repassa mensagens corretas para serem exibidas na tela de criação
      if (error.response?.status === 409) {
        throw new Error("Já existe um serviço com este nome. Tente novamente");
      } else if (error.response?.status === 400) {
        throw new Error(
          "Dados inválidos para criar o serviço. Tente novamente"
        );
      } else {
        throw new Error("Erro ao criar serviço. Tente novamente mais tarde");
      }
    } finally {
      setLoading(false);
    }
  };

  //Funçao para alternar status do serviço
  // o uso do callbabck memoriza (cachea) uma função entre renderizações, evitando recriações desnecessárias.
  const toggleServiceStatus = useCallback(
    async (id: string, activate: boolean) => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return false;
        //se o serviço estiver ativo usa a rota de inativar se não a de ativar o id e se esta ativo ou nao vem por props
        const endpoint = activate
          ? `/servicos/${id}/ativar`
          : `/servicos/${id}/inativar`;

        // faz chamada para api para atualizar o serviço
        await api.put(
          endpoint,
          {},
          {
            headers: { Authorization: `${token}` },
          }
        );

        // Atualiza o estado local imediatamente para melhor UX
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === id ? { ...service, ativo: activate } : service
          )
        );
        return true;
      } catch (error) {
        throw new Error("Erro ao ativar ou inativar");
      }
    },
    // criando a função apenas uma vez
    []
  );

  // ** funçoes para atualização de um serviço especifico **
  const updateNome = async (id: string, nome: string): Promise<boolean> => {
    if (!services) return false;

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;
      // faz chamada da api para atualizar o nome apenas
      await api.put(
        `/servicos/${id}`,
        { nome },
        { headers: { Authorization: `${token}` } }
      );
      //atualiza o estado local com o novo nome do serviço que foi atualizado
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? { ...service, nome } : service
        )
      );

      return true;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error("Nome do serviço já existe."); // Erro específico para nome duplicado
      } else {
        throw new Error("Erro ao atualizar nome do serviço."); // Outros erros
      }
    }
  };

  const updateDescricao = async (
    id: string,
    descricao: string
  ): Promise<boolean> => {
    if (!services) return false;

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;
      // faz chamada da api para atualizar a descrição apenas
      await api.put(
        `/servicos/${id}`,
        { descricao },
        { headers: { Authorization: `${token}` } }
      );
      //atualiza o estado local com a nova descrição do serviço que foi atualizado
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? { ...service, descricao } : service
        )
      );

      return true;
    } catch (error) {
      // erro generico
      throw new Error("Erro ao atualizar descrição do serviço.");
    }
  };

  const updateCusto = async (id: string, custo: number): Promise<boolean> => {
    if (!services) return false;

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;
      // faz chamada da api para atualizar o custo apenas
      await api.put(
        `/servicos/${id}`,
        { custo },
        { headers: { Authorization: `${token}` } }
      );
      //atualiza o estado local com o novo custo do serviço que foi atualizado
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? { ...service, custo } : service
        )
      );

      return true;
    } catch (error) {
      //erro generico
      throw new Error("Erro ao atualizar custo do serviço.");
    }
  };

  const updateDuracao = async (
    id: string,
    duracao: number
  ): Promise<boolean> => {
    if (!services) return false;

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return false;
      // faz chamada da api para atualizar a duração apenas
      await api.put(
        `/servicos/${id}`,
        { duracao },
        { headers: { Authorization: `${token}` } }
      );
      //atualiza o estado local com a nova duracao do serviço que foi atualizado
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? { ...service, duracao } : service
        )
      );

      return true;
    } catch (error) {
      //erro generico
      throw new Error("Erro ao atualizar duração do serviço.");
    }
  };
  // ** Fim das funções de atuaizaçao **

  // Carrega os serviços quando o provider é montado
  useEffect(() => {
    loadServices();
  }, []);

  return (
    <EmpresaServiceContext.Provider
      value={{
        services,
        loading,
        loadServices,
        createService,
        toggleServiceStatus,
        updateNome,
        updateDescricao,
        updateDuracao,
        updateCusto,
      }}
    >
      {children}
    </EmpresaServiceContext.Provider>
  );
};

export const useEmpresaServices = () => {
  const context = useContext(EmpresaServiceContext);
  if (!context) {
    throw new Error(
      "useEmpresaServices must be used within a EmpresaServiceProvider"
    );
  }
  return context;
};
