import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import { useMessage } from "./MessageContext";

// Tipos que para clientes serviços e agendamentos formatados para uso na listagem de agendamentos
export type Cliente = {
  nome: string;
  email: string;
  telefone: string;
};

export type Servico = {
  nome: string;
  descricao: string;
  duracao: number;
  custo: number;
};

export type Agendamento = {
  id: string;
  data: string;      // Data em formato ISO (ex: "2025-04-05T00:00:00Z")  
  dataFormatada: string; // Data formatada para exibição (ex: "05/04/2025")
  dataObj: Date;       // Objeto Date para manipulação de datas
  horario: string;
  cliente: Cliente;
  servico: Servico;
};

export type AgendamentosContextType = {
  agendamentos: Agendamento[];
  loading: boolean;
  loadAgendamentos: () => Promise<void>;
  agendamentoSelecionado: Agendamento | null;
  setAgendamentoSelecionado: (agendamento: Agendamento | null) => void;
};

const AgendamentosContext = createContext<AgendamentosContextType | undefined>(undefined);

// Função utilitária para formatar a data do agendamento de fotma correta a ser exibida
const formatarData = (dataISO: string): { dataFormatada: string, dataObj: Date } => {
  try {
    // Divide a string ISO para obter apenas a data (ano, mês, dia)
    const [year, month, day] = dataISO.split('T')[0].split('-');
    const dataObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    
    return {
      dataFormatada: `${day}/${month}/${year}`,
      dataObj
    };
  } catch {
    const dataObj = new Date();
    // Caso ocorra erro, retorna uma data padrão e marca como "Data inválida"
    return {
      dataFormatada: 'Data inválida',
      dataObj
    };
  }
};
// Provider do contexto, que irá envolver os componentes filhos
export const AgendamentosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);
  const [loading, setLoading] = useState(false);
  const {showMessage} = useMessage(); // Hook para mostrar mensagens de feedback
// Função para carregar os agendamentos da API
  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setAgendamentos([]);
        return;
      }

      const response = await api.get("/agendamentos-empresa", {
        headers: { Authorization: `${token}` },
      });

       // Formata os agendamentos recebidos da API
      const agendamentosFormatados = response.data.agendamentos.map((ag: any) => {
        const { dataFormatada, dataObj } = formatarData(ag.data);
        return {
          ...ag,
          dataFormatada,
          dataObj
        };
      });

      setAgendamentos(agendamentosFormatados);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setAgendamentos([]);
      } else {
        showMessage("danger", "Erro ao carregar agendamentos. Tente novamente mais tarde")
      }
    } finally {
      setLoading(false);
    }
  };
// Carrega os agendamentos assim que o componente for montado
  useEffect(() => {
    loadAgendamentos();
  }, []);

  return (
    <AgendamentosContext.Provider
      value={{
        agendamentos,
        loading,
        loadAgendamentos,
        agendamentoSelecionado,
        setAgendamentoSelecionado,
      }}
    >
      {children}
    </AgendamentosContext.Provider>
  );
};

export const useAgendamentos = (): AgendamentosContextType => {
  const context = useContext(AgendamentosContext);
  if (!context) {
    throw new Error("useAgendamentos deve ser usado dentro de um AgendamentosProvider");
  }
  return context;
};