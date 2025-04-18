import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/src/services/api";
import { useAgendamentos } from "./AgendamentosEmpresaContext";
import { useMessage } from "./MessageContext";

// Interface que define a estrutura de uma grade de horários
interface GradeHorario {
  id: string;
  diaSemana: number; // 0 (Domingo) a 6 (Sábado)
  inicio: string; // Formato "HH:MM"
  fim: string; // Formato "HH:MM"
  intervalo: number; // Em minutos
  empresaId: string;
}

// Interface para indisponibilidades
export interface Indisponibilidade {
  id: string;
  motivo: string; // Razão da indisponibilidade
  horario: string; // Intervalo no formato "HH:MM-HH:MM"
  data: string | null; // Data específica ou null para indisponibilidade recorrente
  empresaId: string;
}

// Interface para horários disponíveis
export interface HorarioDisponivel {
  horario: string; // Formato "HH:MM"
  ocupado: boolean; // Se já tem agendamento
  indisponivel: boolean; // Se está bloqueado por indisponibilidade
}

// Tipo para armazenar horários por data
interface HorariosPorData {
  [key: string]: HorarioDisponivel[]; // Chave é a data no formato "YYYY-MM-DD"
}

// Interface que define o que o contexto fornece
interface GradeHorariosContextData {
  gradeHorarios: GradeHorario[]; // Grades cadastradas
  horariosDisponiveis: HorariosPorData; // Horários disponíveis por data
  selectedDate: string | null; // Data selecionada
  loading: boolean; // Estado de carregamento
  setSelectedDate: (date: string | null) => void;
  fetchGradeHorarios: () => Promise<void>;
  fetchHorariosDisponiveis: (date: Date) => Promise<HorarioDisponivel[]>;
  getGradeForDay: (dateString: string) => GradeHorario | undefined;
  salvarGradeHorario: (config: {
    id: string;
    diaSemana: number;
    inicio: string;
    fim: string;
    intervalo: number;
  }) => Promise<void>;//atualizar ou criar uma nova grade de horario
  removerGradeHorario: (diaSemana: number) => Promise<void>; // Remove grade de horários por dia da semana
  indisponibilidades: Indisponibilidade[]; // Lista de indisponibilidades
  fetchIndisponibilidades: () => Promise<void>;
  removeIndisponibilidade: (id: string) => Promise<void>//remove indisponibilidade por id
  createIndisponibilidade: (data: {
    inicio: string;
    fim: string;
    motivo?: string;
    data: string | null;
  }) => Promise<void>;//cria uma nova indisponibilidade
  getMotivoIndisponibilidade: (data: string, horario: string) => string | null;
  refreshHorarios: () => Promise<void>; // Atualiza todos os dados
}

// Criação do contexto
const GradeHorariosContext = createContext<GradeHorariosContextData>(
  {} as GradeHorariosContextData
);

// Provider do contexto
export const GradeHorariosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Estado principal que armazena todos os dados
  const [state, setState] = useState({
    gradeHorarios: [] as GradeHorario[],
    indisponibilidades: [] as Indisponibilidade[],
    horariosDisponiveis: {} as HorariosPorData,
    selectedDate: null as string | null,
    loading: true,
  });

  // contexto de mensagem e de recarregar os agendamentos
  const { showMessage } = useMessage();
  const { loadAgendamentos } = useAgendamentos();

  // Formata uma data para o formato "YYYY-MM-DD"
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Gera um array com os próximos X dias a partir de hoje
  const getNextDays = (daysCount: number): Date[] => {
    const today = new Date();
    // Normaliza para evitar problemas
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return Array.from({ length: daysCount }, (_, i) => {
      const date = new Date(normalizedToday);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  // Tratamento centralizado de erros da API
  const handleApiError = (error: any, defaultMessage: string) => {
    // Caso especial para 404 em indisponibilidades (não mostra mensagem)
    if (
      error.response?.status === 404 &&
      error.config.url.includes("/indisponibilidade-empresa")
    ) {
      return; // Silencioso pois é normal não ter indisponibilidades
    }

    // Verifica se é um erro de rede (sem conexão)
    if (error.message === "Network Error") {
      showMessage("danger", "Erro de conexão - Verifique sua internet ou entre em contato com o suporte!");
      return;
    }

    // Verifica se o servidor está indisponível (erro 5xx)
    if (error.response?.status >= 500 && error.response?.status < 600) {
      showMessage(
        "danger",
        "Servidor indisponível - Tente novamente mais tarde ou entre em contato com o suporte!"
      );
      return;
    }

    // Caso especial para 404 (recurso não encontrado)
    if (error.response?.status === 404) {
      showMessage("info", "Nenhum dado de horários encontrado");
      return;
    }

    // Default - mostra a mensagem padrão recebida como parâmetro
    showMessage("danger", defaultMessage);
  };

  // Função genérica para fazer requisições com token
  const fetchWithToken = async (endpoint: string) => {
    const token = await AsyncStorage.getItem("userToken");
    return api.get(endpoint, { headers: { Authorization: `${token}` } });
  };

  // Busca os horários disponíveis para uma data específica
  const fetchHorariosDisponiveis = async (
    date: Date
  ): Promise<HorarioDisponivel[]> => {
    try {
      const formattedDate = formatDate(date);
      const response = await fetchWithToken(
        `/horarios-disponiveis-empresa?data=${formattedDate}`
      );
      return response.data;
    } catch (error) {
      return []; // Retorna array vazio em caso de erro
    }
  };

  // Busca todas as grades de horário cadastradas
  const fetchGradeHorarios = async (): Promise<void> => {
    try {
      const response = await fetchWithToken("/grade-horarios");
      setState((prev) => ({ ...prev, gradeHorarios: response.data }));
    } catch (error) {
      handleApiError(error, "Erro ao buscar grade de horários");
    }
  };

  // Busca todas as indisponibilidades
  const fetchIndisponibilidades = async (): Promise<void> => {
    try {
      const response = await fetchWithToken("/indisponibilidade-empresa");
      setState((prev) => ({ ...prev, indisponibilidades: response.data }));
    } catch (error: any) {
      // 404 é normal para indisponibilidades (pode não ter nenhuma)
      if (error.response?.status !== 404) {
        handleApiError(error, "Erro ao buscar indisponibilidades");
      }
    }
  };
  // funçao para salvar ou atualizar um grade de horario
  const salvarGradeHorario = async (config: {
    id: string;
    diaSemana: number;
    inicio: string;
    fim: string;
    intervalo: number;
  }): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      // cria um payload com os dados da grade de horario
      const payload = {
        diasSemana: [config.diaSemana],
        inicio: config.inicio,
        fim: config.fim,
        intervalo: config.intervalo,
      };
      // verifica se o id da grade de horario começa com novo- para saber se e uma nova grade ou uma atualização
      const ehNovo = config.id.startsWith("novo-");
  
      if (ehNovo) {
        // Criação (POST)
        await api.post("/grade-horario", payload, {
          headers: { Authorization: token },
        });
      } else {
        // Atualização (PUT)
        await api.put(`/grade-horario/${config.id}`, payload, {
          headers: { Authorization: token },
        });
      }
  
      // Atualiza a lista de horários após salvar
      await refreshHorarios();
    } catch (error) {
      throw error; // Propaga o erro para ser tratado no componente
    }
  };
  // funçao para remover uma grade de horario
  const removerGradeHorario = async (diaSemana: number): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("userToken");
  
      // Verifica se é o último dia da grade
      const isUltimoDia = state.gradeHorarios.filter(g => g.diaSemana !== diaSemana).length === 0;
  
      // Executa a remoção na API
      await api.delete("/grade-horario/remover-dia", {
        headers: { Authorization: token },
        data: { diaSemana },
      });
  
      // Atualização otimista do estado
      setState(prev => {
        const newGradeHorarios = prev.gradeHorarios.filter(g => g.diaSemana !== diaSemana);
        
        const newHorariosDisponiveis = { ...prev.horariosDisponiveis };
        
        // Se for o último dia, limpa todos os horários disponíveis
        if (isUltimoDia) {
          Object.keys(newHorariosDisponiveis).forEach(date => {
            newHorariosDisponiveis[date] = [];
          });
        } else {
          // Caso contrário, limpa apenas os horários do dia removido
          Object.keys(newHorariosDisponiveis).forEach(date => {
            const dateObj = new Date(date);
            if (dateObj.getDay() === diaSemana) {
              newHorariosDisponiveis[date] = [];
            }
          });
        }
        //atualiza o estado com as novas grades e horarios
        return {
          ...prev,
          gradeHorarios: newGradeHorarios,
          horariosDisponiveis: newHorariosDisponiveis
        };
      });
  
      // Atualiza os dados 
      await refreshHorarios();
    } catch (error) {
      // Reverte a atualização otimista em caso de erro
      await fetchGradeHorarios();
      throw error; //propaga o erro para ser tratado no componente
    }
  };

//remove uma indisponibilidade
const removeIndisponibilidade = async (id: string): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    await api.delete(`/indisponibilidade/remover`, {
      headers: { Authorization: `${token}` },
      data: { indisponibilidadeId: id },
    });
    
    // Atualização otimista do estado
    setState(prev => ({
      ...prev,
      indisponibilidades: prev.indisponibilidades.filter(item => item.id !== id)
    }));
    
    // Atualiza os horários disponíveis
    await refreshHorarios();
  } catch (error) {
    // Reverte a atualização otimista em caso de erro
    await fetchIndisponibilidades();
    throw error; // Propaga o erro para ser tratado no componente
  }
};

//cria nova indisponibilidade
const createIndisponibilidade = async (data: {
  inicio: string;
  fim: string;
  motivo?: string;
  data: string | null;
}): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const formattedDate = data.data 
      ? data.data.split("-").reverse().join("-")
      : null;

    await api.post(
      "/indisponibilidade/criar",
      {
        inicio: data.inicio,
        fim: data.fim,
        motivo: data.motivo,
        data: formattedDate,
      },
      { headers: { Authorization: `${token}` } }
    );

    await fetchIndisponibilidades(); // Atualiza a lista
    await refreshHorarios(); // Atualiza os horários disponíveis
  } catch (error) {
    throw error; // Propaga o erro para tratamento específico
  }
};

  // Encontra a grade de horários para um dia específico da semana
  const getGradeForDay = (dateString: string): GradeHorario | undefined => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0-6 (Domingo-Sábado)
    return state.gradeHorarios.find((grade) => grade.diaSemana === dayOfWeek);
  };

  // Verifica se um horário específico está indisponível e retorna o motivo
  const getMotivoIndisponibilidade = (
    data: string,
    horario: string
  ): string | null => {
    const [hora, minuto] = horario.split(":").map(Number);
    const horarioMinutos = hora * 60 + minuto;

    // Procura uma indisponibilidade que inclua este horário
    const indisponibilidade = state.indisponibilidades.find((ind) => {
      const [inicio, fim] = ind.horario.split("-");
      const [inicioHora, inicioMinuto] = inicio.split(":").map(Number);
      const [fimHora, fimMinuto] = fim.split(":").map(Number);

      const inicioMinutos = inicioHora * 60 + inicioMinuto;
      const fimMinutos = fimHora * 60 + fimMinuto;

      // Verifica se o horário está dentro do intervalo e se a data coincide
      return (
        horarioMinutos >= inicioMinutos &&
        horarioMinutos < fimMinutos &&
        (!ind.data || ind.data === data)
      );
    });

    return indisponibilidade?.motivo || null;
  };

  // Atualiza todos os dados de horários
  const refreshHorarios = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const dates = getNextDays(7); // Próximos 7 dias
      const formattedDates = dates.map(formatDate);

      // Faz todas as requisições em paralelo
      const [gradeResponse, _, horariosResults] = await Promise.all([
        fetchWithToken("/grade-horarios"),
        Promise.all([
          fetchIndisponibilidades(),
          loadAgendamentos(), // Carrega os agendamentos também para consistencia dos dados
        ]),
        Promise.all(dates.map((date) => fetchHorariosDisponiveis(date))),
      ]);

      // Processa os resultados
      const gradeHorarios = gradeResponse.data;
      const hasGradeHorarios = gradeHorarios.length > 0;

      // Organiza os horários por data
      const horariosPorData = formattedDates.reduce((acc, date, index) => {
        acc[date] = horariosResults[index] || [];
        return acc;
      }, {} as HorariosPorData);

      // Verifica se há algum horário disponível
      const hasAnyHorarios = Object.values(horariosPorData).some(
        (horarios) => horarios.length > 0
      );

      // Mostra mensagens informativas quando não há dados
      if (!hasAnyHorarios && hasGradeHorarios) {
        showMessage(
          "info",
          "Nenhum horário disponível encontrado para os próximos dias"
        );
      } else if (!hasGradeHorarios) {
        showMessage("info", "Nenhum horário cadastrado para esta empresa");
      }

      // Atualiza o estado com os novos dados
      setState((prev) => ({
        ...prev,
        gradeHorarios,
        horariosDisponiveis: horariosPorData,
        selectedDate: prev.selectedDate || formattedDates[0], // Mantém a seleção ou usa o primeiro dia
        loading: false,
      }));
    } catch (error) {
      handleApiError(error, "Erro ao atualizar horários");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Carrega os dados quando o componente é montado
  useEffect(() => {
    refreshHorarios();
  }, []);

  // Provedor do contexto que disponibiliza todos os dados e funções
  return (
    <GradeHorariosContext.Provider
      value={{
        ...state,
        setSelectedDate: (date) =>
          setState((prev) => ({ ...prev, selectedDate: date })),
        fetchGradeHorarios,
        fetchHorariosDisponiveis,
        getGradeForDay,
        salvarGradeHorario,
        removerGradeHorario,
        fetchIndisponibilidades,
        removeIndisponibilidade,
        createIndisponibilidade,
        getMotivoIndisponibilidade,
        refreshHorarios,
      }}
    >
      {children}
    </GradeHorariosContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useGradeHorarios = (): GradeHorariosContextData => {
  const context = useContext(GradeHorariosContext);
  if (!context) {
    throw new Error(
      "useGradeHorarios must be used within a GradeHorariosProvider"
    );
  }
  return context;
};
