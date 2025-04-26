import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMessage } from "./MessageContext";

// inteface do modelo de serviço para o cliente como retorna do back
interface Servico {
  id: string;
  nome: string;
  descricao: string;
  duracao: number;
  custo: number;
  empresa: {
    nomeEmpresa: string;
    email: string;
    telefone: string;
    endereco: string;
  };
}
// interface de agendamento de usuario
export interface AgendamentoUser {
  id: string;
  data: string;
  dataFormatada: string;
  dataObj: Date;
  horario: string;
  servico: Servico;
}
// Interface para o retorno da API de criação
interface AgendamentoResponse {
  id: string;
  data: string;
  horario: string;
  ativo: boolean;
  clienteId: string;
  servicoId: string;
  createdAt: string;
}
// Interface para a resposta completa da API
interface CriarAgendamentoResponse {
  message: string;
  agendamento: AgendamentoResponse;
}
// interface para a criação de um agendamento
interface CriarAgendamentoData {
  data: string;
  horario: string;
  servicoId: string;
}

// resposta do gendamento vindo do back
interface AgendamentosResponse {
  message: string;
  total: number;
  agendamentos: AgendamentoUser[];
}
// interface com as funçoes do contexto
interface AgendamentoUserContextData {
  agendamentos: AgendamentoUser[];
  loading: boolean;
  loadDelete: boolean;
  loadAgendamentos: () => Promise<void>;
  agendamentoSelecionado: AgendamentoUser | null;
  setAgendamentoSelecionado: (agendamento: AgendamentoUser | null) => void;
  deleteAgendamento: (id: string) => Promise<void>;
  criarAgendamento: (data: CriarAgendamentoData) => Promise<void>; // Mudou o retorno para void
}

const AgendamentoUserContext = createContext<AgendamentoUserContextData>(
  {} as AgendamentoUserContextData
);

// Função utilitária para formatar a data
const formatarData = (
  dataISO: string
): { dataFormatada: string; dataObj: Date } => {
  try {
    const [year, month, day] = dataISO.split("T")[0].split("-");
    const dataObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
    );

    return {
      dataFormatada: `${day}/${month}/${year}`,
      dataObj,
    };
  } catch {
    const dataObj = new Date();
    return {
      dataFormatada: "Data inválida",
      dataObj,
    };
  }
};

export const AgendamentoUserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  //estado de todos os agendamentos
  const [agendamentos, setAgendamentos] = useState<AgendamentoUser[]>([]);
  // estado para controle dos loadings
  const [loading, setLoading] = useState(false);
  const [loadDelete, setLoadDelete] = useState(false);
  // estado para controle do agendamento selecionado
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<AgendamentoUser | null>(null);
  // hook da mensagem de feedback
  const { showMessage } = useMessage();

  // funçao para carregar os agendamentos
  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      // envia req e espera resposta no formato da interface
      const response = await api.get<AgendamentosResponse>(
        "/meus-agendamentos",
        {
          headers: { Authorization: `${token}` },
        }
      );
      // verifica se foi bem sucedido se sim preenche os novos campos de data formatada e dataobj e seta os agendamentos
      if (response.data.message === "Appointments retrieved successfully") {
        const agendamentosFormatados = response.data.agendamentos.map((ag) => {
          const { dataFormatada, dataObj } = formatarData(ag.data);
          return {
            ...ag,
            dataFormatada,
            dataObj,
          };
        });
        setAgendamentos(agendamentosFormatados);
        // tratamento de erro personalizados
      } else {
        showMessage("danger", "Erro ao carregar agendamentos");
        throw new Error("Erro ao carregar agendamentos");
      }
    } catch (err: any) {
      if (err.response) {
        // O servidor respondeu com um status code fora do intervalo
        if (err.response.status === 500) {
          showMessage(
            "danger",
            "Erro interno no servidor. Tente novamente mais tarde."
          );
        } else {
          showMessage(
            "danger",
            "Erro ao carregar seus agendamentos entre em contato com o suporte"
          );
        }
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta
        showMessage(
          "danger",
          "Sem resposta do servidor. Verifique sua conexão com a internet."
        );
      } else {
        // Outro tipo de erro
        showMessage(
          "danger",
          "Ocorreu um erro inesperado ao carregar seus agendamentos. Entre em contato com o suporte!"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // funçao para deletar um agendamento
  const deleteAgendamento = async (id: string) => {
    try {
      setLoadDelete(true);
      const token = await AsyncStorage.getItem("userToken");
      // Chamada para a API conforme especificado
      await api.delete(`/meus-agendamentos-excluir/${id}`, {
        headers: { Authorization: `${token}` },
      });
      // Atualiza o estado local removendo o agendamento excluído
      setAgendamentos((prevAgendamentos) =>
        prevAgendamentos.filter((ag) => ag.id !== id)
      );
      // Se o agendamento excluído era o selecionado, limpa a seleção
      if (agendamentoSelecionado?.id === id) {
        setAgendamentoSelecionado(null);
      }
      showMessage("success", "Agendamento cancelado com sucesso!");
    } catch (err: any) {
      let errorMessage = "Erro ao cancelar agendamento";
      // erro especifico da api para agendamentos com menos de 24 de "distancia"
      if(err.response.data.error === "Appointments can only be canceled up to 24 hours in advance"){
        errorMessage = "Só é possivel cancelar um agendamento com 24h de antecedência!"
      }
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "Agendamento não encontrado";
        } else if (err.response.status === 500) {
          errorMessage = "Erro interno no servidor";
        }
      } else if (err.request) {
        errorMessage = "Sem resposta do servidor. Verifique sua conexão";
      }
      showMessage("danger", errorMessage);
      throw err;
    }finally{
      setLoadDelete(false)
    }
  };

  // criar agendamento
  const criarAgendamento = async (
    agendamentoData: CriarAgendamentoData
  ): Promise<void> => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      // Cria o agendamento na API
      const response = await api.post<CriarAgendamentoResponse>(
        "/agendar",
        agendamentoData,
        {
          headers: { Authorization: `${token}` },
        }
      );

      // se tiver resposta de sucesso Recarrega a lista completa de agendamentos
      if (response.data.message === "Appointment created successfully") {
        showMessage("success", "Agendamento criado com sucesso!");
        await loadAgendamentos();
        // se nao repassa o erro
      } else {
        throw new Error("Erro ao criar agendamento");
      }
      // tratamento de erro personalizado para cada mensagem
    } catch (err: any) {
      let errorMessage = "Erro ao criar agendamento";
      if (err.response) {
        if (err.response.data.error === "Requested time conflicts with an existing appointment") {
          errorMessage ="O Horário já foi ocupado! Por favor atualize os horários disponiveis e tente novamente.";
        } else if (err.response.data.error === "Appointment date and time must be in the future") {
          errorMessage = "O agendamento deve ter data futura, tente novamente.";
        } else if (err.response.data.error === "Requested time is unavailable due to a scheduled unavailability") {
          errorMessage = "A uma indisponibilidade no horario solicitato, atualize e tente novamente!";
        } else if (err.response.status === 404) {
          errorMessage = "Dados invalidos para criar agendamento";
        } else if (err.response.status === 400) {
          errorMessage = "Dados invalidos para criar agendamento";
        } else if (err.response.status === 404) {
          errorMessage = err.response.data.error || "Serviço não encontrado";
        } else if (err.response.status === 500) {
          errorMessage = "Erro interno no servidor";
        } else if (err.request) {
          errorMessage = "Sem resposta do servidor. Verifique sua conexão";
        }
      }
      showMessage("danger", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // chama o load assim que o componente e contexto e montado a primeira vez
  useEffect(() => {
    loadAgendamentos();
  }, []);

  return (
    <AgendamentoUserContext.Provider
      value={{
        agendamentos,
        loading,
        loadDelete,
        loadAgendamentos,
        agendamentoSelecionado,
        setAgendamentoSelecionado,
        deleteAgendamento,
        criarAgendamento,
      }}
    >
      {children}
    </AgendamentoUserContext.Provider>
  );
};

export const useAgendamentoUser = () => {
  const context = useContext(AgendamentoUserContext);

  if (!context) {
    throw new Error(
      "useAgendamentoUser deve ser usado dentro de um AgendamentoUserProvider"
    );
  }

  return context;
};
