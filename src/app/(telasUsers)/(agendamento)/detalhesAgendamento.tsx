import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import api from "@/src/services/api";
import { useMessage } from "@/src/context/MessageContext";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedButton } from "@/src/components/ThemedButton";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";
import { useAgendamentoUser } from "@/src/context/AgendamentosUserContext";
import { ConfirmacaoModal } from "@/src/components/agendamentosConponents/ConfirmacaoModal";
import HorariosList from "@/src/components/agendamentosConponents/HorariosList";
import DateSelector from "@/src/components/horariosComponenents/tabelaDeHorarios/DataSelector";

// interface do serviço
interface Servico {
  id: string;
  nome: string;
  descricao: string;
  custo: number;
  duracao: string;
  empresaId: string;
}

// interface de horario como ele vem da API
interface Horario {
  horario: string;
  ocupado: boolean;
  indisponivel: boolean;
}
// interface de empresa com seus respectivos serviços
interface Empresa {
  id: string;
  nomeEmpresa: string;
  image?: string | null;
  description?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  createdAt: Date;
  servicos: Servico[];
}

export default function DetalhesAgendamento() {
  // Formata Date para "YYYY-MM-DD" (ISO date)
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };
  // Converte "YYYY-MM-DD" para Date (com validação)
  const parseDateString = (dateString: string): Date => {
    return new Date(dateString + "T00:00:00");
  };
  // Formata para padrão BR "DD/MM/YYYY"
  const formatDisplayDate = (dateString: string): string => {
    const [y, m, d] = dateString.split("-");
    return `${d}/${m}/${y}`;
  };
  // Converte "HH:MM" para minutos (com validação)
  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  // Converte minutos para "HH:MM" (24h format)
  const minutesToTime = (totalMinutes: number): string => {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };
  // culculo do ultimo horario de atendimento
  const calcularHorarioFinal = (inicio: string, duracao: string): string => {
    return minutesToTime(timeToMinutes(inicio) + parseInt(duracao));
  };

  // Obtém o ID do serviço dos parâmetros de navegação
  const { servicoId } = useLocalSearchParams();

  // Estados da aplicação:
  const [servico, setServico] = useState<Servico | null>(null); // Serviço selecionado
  const [loading, setLoading] = useState(true); // Carregamento inicial
  const [sendLoading, setSendLoading] = useState(false); // Envio do agendamento
  const [horarios, setHorarios] = useState<Horario[]>([]); // Horários disponíveis
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date()) // Data selecionada (inicia com data atual formatada)
  );
  const [showDatePicker, setShowDatePicker] = useState(false); // Visibilidade do date picker
  const [showModal, setShowModal] = useState(false); // Visibilidade do modal
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null); // Horário selecionado
  const [empresa, setEmpresa] = useState<Empresa>(); // Dados da empresa

  // Hooks customizados:
  const { showMessage } = useMessage(); // Para exibir mensagens/flashes
  const { criarAgendamento } = useAgendamentoUser(); // Função para criar agendamento

  // Gera um array com as datas dos próximos 7 dias no formato "YYYY-MM-DD"
  const proximos7Dias = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(); // Data atual
    date.setDate(date.getDate() + i); // Adiciona 'i' dias à data atual
    return formatDate(date); // Formata para "YYYY-MM-DD"
  });

  // Função chamada quando uma nova data é selecionada
  const handleDateSelected = (date: string) => {
    setSelectedDate(date); // Atualiza a data selecionada
    setSelectedHorario(null); // Reseta o horário selecionado
    // Se existir um serviço carregado, busca os horários para a nova data
    if (servico) {
      fetchHorarios(servico.empresaId, date);
    }
  };

  // busca detalhes do serviço
  async function fetchServico() {
    try {
      setLoading(true); // Ativa estado de carregamento
      // Recupera token de autenticação
      const token = await AsyncStorage.getItem("userToken");
      // Faz requisição para API
      const response = await api.get(`/servicos/${servicoId}`, {
        headers: { Authorization: `${token}` },
      });
      setServico(response.data); // Armazena dados do serviço
      // Busca complementares:
      fetchHorarios(response.data.empresaId, formatDate(new Date())); // Horários para hoje
      fetchEmpresa(response.data.empresaId); // Dados da empresa
    } catch (error) {
      showMessage("danger", "Erro ao buscar serviço"); // Notifica erro
    } finally {
      setLoading(false); // Desativa carregamento (sucesso ou erro)
    }
  }
  // busca detalhes da empresa
  const fetchEmpresa = async (empresaId: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get(`/companies/${empresaId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setEmpresa(response.data);
    } catch (error) {
      showMessage("danger", "Erro ao buscar empresa:");
    }
  };

  /**   *** MAIS COMENTADA POR QUESTÕES DE COMPLEXIDADE ***
   * Busca horários disponíveis para agendamento em uma empresa específica
   * param empresaId - ID da empresa
   * param data - Data no formato 'YYYY-MM-DD' para consulta
   */
  const fetchHorarios = async (empresaId: string, data: string) => {
    try {
      // 1. AUTENTICAÇÃO
      // Obtém o token JWT armazenado localmente
      const token = await AsyncStorage.getItem("userToken");

      // 2. REQUISIÇÃO À API
      // Faz chamada GET para endpoint de horários disponíveis
      const response = await api.get(
        `/horarios-disponiveis?empresaId=${empresaId}&data=${data}`,
        { headers: { Authorization: `${token}` } } // Envia token no header
      );

      // 3. TRATAMENTO INICIAL DA RESPOSTA
      const horariosDisponiveis = response.data;

      // Se não houver horários ou array vazio:
      if (!horariosDisponiveis || horariosDisponiveis.length === 0) {
        setHorarios([]); // Limpa horários
        return; // Encerra função
      }

      // 4. CÁLCULO DE INTERVALOS E HORÁRIOS
      /**
       * Converte horário 'HH:MM' para minutos totais
       * example '09:30' → 570 (9*60 + 30)
       */
      const parseHorarioEmMinutos = (horario: string) => {
        const [h, m] = horario.split(":").map(Number);
        return h * 60 + m;
      };

      // Calcula o primeiro horário em minutos
      const primeiroHorarioMin = parseHorarioEmMinutos(
        horariosDisponiveis[0].horario
      );

      // Calcula o segundo horário (se existir) ou usa fallback de 30min
      const segundoHorarioMin = horariosDisponiveis[1]
        ? parseHorarioEmMinutos(horariosDisponiveis[1].horario)
        : primeiroHorarioMin + 30; // Default 30min caso não haja segundo horário

      // Calcula intervalo entre horários (em minutos)
      const intervaloMinutos = segundoHorarioMin - primeiroHorarioMin;

      // Calcula o último horário do expediente
      const ultimoHorarioMin = parseHorarioEmMinutos(
        horariosDisponiveis[horariosDisponiveis.length - 1].horario
      );

      // Calcula horário de fechamento (último horário + intervalo)
      const horarioFimExpediente = ultimoHorarioMin + intervaloMinutos;

      // 5. DURAÇÃO DO SERVIÇO
      // Converte duração do serviço para minutos (se existir)
      const duracaoMinutos = servico ? parseInt(servico.duracao) : 0;

      // 6. VERIFICAÇÃO DE DATA ATUAL
      // Compara se a data selecionada é hoje
      const hoje = new Date();
      const dataSelecionada = new Date(`${data}T00:00:00`); // Força horário 00:00:00
      const isHoje = hoje.toDateString() === dataSelecionada.toDateString();

      // 7. AJUSTE DE FUSO HORÁRIO (BRT)
      /**
       * Ajusta data para o fuso horário de Brasília (UTC-3)
       * param data - Data a ser ajustada
       */
      const ajustarParaBRT = (data: Date) => {
        const offsetBRT = -3 * 60; // -3 horas em minutos
        const offsetLocal = data.getTimezoneOffset(); // Offset do cliente
        return new Date(data.getTime() + (offsetBRT + offsetLocal) * 60 * 1000);
      };

      // Obtém horário atual ajustado para BRT
      const agoraBRT = ajustarParaBRT(new Date());
      const horarioAtualMinutos =
        agoraBRT.getHours() * 60 + agoraBRT.getMinutes();

      // 8. FILTRAGEM DE HORÁRIOS
      const horariosFiltrados = horariosDisponiveis.filter(
        (horario: Horario) => {
          // Descarta horários ocupados ou indisponíveis
          if (horario.ocupado || horario.indisponivel) return false;

          const horarioMin = parseHorarioEmMinutos(horario.horario);

          // Verifica se o serviço cabe no expediente
          if (horarioMin + duracaoMinutos > horarioFimExpediente) return false;

          // Se for hoje, descarta horários que já passaram
          if (isHoje && horarioMin <= horarioAtualMinutos) return false;

          // Mantém horário se passar em todos os filtros
          return true;
        }
      );

      // 9. ATUALIZAÇÃO DE ESTADO
      setHorarios(horariosFiltrados);
    } catch (error: any) {
      // 10. TRATAMENTO DE ERROS
      if (error?.status === 404) {
        // Caso específico para "não encontrado"
        setHorarios([]);
      } else {
        // Outros erros
        showMessage("danger", "Erro ao buscar horários");
      }
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false); // Fecha o seletor de datas

    if (date) {
      // Se uma data foi selecionada
      const dateString = formatDate(date); // Converte para formato 'YYYY-MM-DD'
      setSelectedDate(dateString); // Atualiza estado com nova data

      if (servico) {
        // Se já tiver um serviço carregado
        fetchHorarios(servico.empresaId, dateString); // Busca horários para nova data
      }
    }
  };

  const handleConfirmAgendamento = async () => {
    try {
      setSendLoading(true); // Ativa estado de carregamento
      // Validação básica
      if (!selectedHorario || !servico) {
        showMessage("danger", "Selecione um horário antes de confirmar");
        return;
      }
      // Prepara dados para API
      const agendamentoData = {
        data: selectedDate, // Data formatada
        horario: selectedHorario, // Horário selecionado
        servicoId: servico.id, // ID do serviço
      };
      // Chama função de criação (contexto/API)
      await criarAgendamento(agendamentoData);
      // Fluxo pós-sucesso:
      setShowModal(false); // Fecha modal
      router.dismissAll(); // Limpa navegação
      router.replace("/(telasUsers)/(reservas)"); // Redireciona
    } catch (error) {
      setShowModal(false); // Fecha modal mesmo em caso de erro
    } finally {
      setSendLoading(false); // Desativa carregamento
    }
  };

  const recarregarTudo = async () => {
    try {
      setLoading(true);
      setHorarios([]);
      setSelectedHorario(null);
      //Recarregar os dados do serviço
      await fetchServico();
      // Se já tiver um serviço carregado, recarregar horários para a data selecionada
      if (servico) {
        await fetchHorarios(servico.empresaId, selectedDate);
      }
      // Recarregar dados da empresa se necessário
      if (servico?.empresaId) {
        await fetchEmpresa(servico.empresaId);
      }
    } catch (error) {
      // em caso de erro
      showMessage("danger", "Erro ao recarregar dados");
    } finally {
      // finaliza o loading
      setLoading(false);
    }
  };

  // montado quando o serviçoid vindo do parametro muda
  useEffect(() => {
    if (servicoId) {
      fetchServico();
    }
  }, [servicoId]);

  // retorno no carregamento
  if (loading) {
    return <ThemedLoadingIndicator message="Carregando horarios..." />;
  }

  // caso de erro se nao encontrar o serviço, empresa ou horarios
  if (!servico || !horarios || !empresa) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={{ textAlign: "center", marginHorizontal: 12 }}>
          Ocorreu um erro e não identificamos o Serviço, empresa ou os horários.
          Pedimos desculpas pelo trastorno. Volte e tente novamente..
        </ThemedText>
        <ThemedButton title="Voltar" onPress={() => router.back()} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">
            Selecione o dia que deseja agendar
          </ThemedText>
          <DateSelector
            dates={proximos7Dias} // Array com as próximas 7 datas
            selectedDate={selectedDate} // Data atualmente selecionada
            onSelectDate={handleDateSelected} // Função chamada ao selecionar nova data
          />
          <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
            OU
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            Selecione uma Data expecifica:
          </ThemedText>

          <ThemedView style={styles.dateContainer}>
            {/* Botão para abrir o seletor de datas */}
            <TouchableOpacity
              style={styles.customDateButton}
              onPress={() => setShowDatePicker(true)} // Mostra o date picker ao clicar
            >
              {/* Texto e ícone do botão */}
              <ThemedText>Escolher outra data</ThemedText>
              <Ionicons name="calendar" size={20} color="#007AFF" />
              {/* Ícone do calendário */}
            </TouchableOpacity>

            {/* Seletor de data (aparece condicionalmente) */}
            {showDatePicker && ( // Só renderiza se showDatePicker for true
              <DateTimePicker
                value={parseDateString(selectedDate)} // Converte a data selecionada (string) para objeto Date
                mode="date" // Modo de seleção (apenas data)
                display="default" // Estilo visual padrão do sistema
                minimumDate={new Date()} // Só permite datas futuras (a partir de hoje)
                onChange={handleDateChange} // Manipulador quando a data é alterada
              />
            )}
          </ThemedView>
          {/* Seção de horários disponíveis */}
          <ThemedText style={styles.sectionTitle}>
            Horários Disponíveis: {formatDisplayDate(selectedDate)}{" "}
            {/* Exibe a data formatada */}
          </ThemedText>
          {/* Lógica de exibição condicional */}
          {horarios.length === 0 ? ( // Caso 1: Nenhum horário retornado
            <ThemedView style={styles.noHorariosContainer}>
              <Ionicons name="time-outline" size={24} color="#666" />
              <ThemedText style={styles.noHorariosText}>
                A empresa não possui horários disponíveis para este dia
              </ThemedText>
            </ThemedView>
          ) : horarios.some((h) => !h.ocupado && !h.indisponivel) ? ( // Caso 2: Existem horários livres
            <HorariosList
              horarios={horarios.filter((h) => !h.ocupado && !h.indisponivel)} // Filtra apenas horários disponíveis
              selectedHorario={selectedHorario}
              onSelectHorario={setSelectedHorario}
            />
          ) : (
            // Caso 3: Todos horários ocupados/indisponíveis
            <ThemedView style={styles.noHorariosContainer}>
              <Ionicons name="close-circle-outline" size={24} color="#666" />
              <ThemedText style={styles.noHorariosText}>
                A agenda da empresa está cheia para esta data
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Card de informações */}
        <ThemedView style={[styles.card, { marginTop: 10 }]}>
          <ThemedText type="subtitle">Dados do agendamento</ThemedText>
          <ThemedView style={styles.infoCard}>
            {/* empresa */}
            <ThemedText type="subtitle">Empresa</ThemedText>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <ThemedText style={styles.infoText}>
                {empresa?.nomeEmpresa}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <ThemedText style={styles.infoText}>
                {empresa?.address || "Empresa não tem endereço cadastrado"}
              </ThemedText>
            </View>
            {/* serviço */}
            <ThemedText type="subtitle">Serviço</ThemedText>
            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={20} color="#666" />
              <ThemedText style={styles.infoText}>{servico.nome}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <ThemedText style={[styles.infoText, { color: "#007AFF" }]}>
                R$ {servico.custo.toFixed(2)}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <ThemedText style={[styles.infoText, { color: "#007AFF" }]}>
                {servico.duracao}min
              </ThemedText>
            </View>
            {/* data e horario */}
            <ThemedText type="subtitle">Data e horário</ThemedText>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <ThemedText style={styles.infoText}>
                {formatDisplayDate(selectedDate)}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <ThemedText
                style={[styles.infoText, !selectedHorario && { color: "red" }]}
              >
                {!selectedHorario
                  ? "Selecione um horário para concluir"
                  : servico
                  ? `Das ${selectedHorario} às ${calcularHorarioFinal(
                      selectedHorario,
                      servico.duracao
                    )}`
                  : "Horário inválido"}
              </ThemedText>
            </View>
          </ThemedView>
        </ThemedView>

        {/* finalizaçao botoes e modais */}
        <ThemedView style={[styles.card, { marginTop: 10 }]}>
          {/* confirma o agendamneto */}
          <ThemedButton
            title="Confirmar Agendamento"
            icon={<Ionicons name="calendar" size={18} color="white" />}
            onPress={() => selectedHorario && setShowModal(true)}
            style={[!selectedHorario && { opacity: 0.6 }]}
            textStyle={{ fontSize: 18 }}
          />
          {/* volta para pagina anterior seleçao de serviços */}
          <ThemedButton
            title="Voltar"
            icon={<Ionicons name="arrow-back" size={18} color="white" />}
            iconPosition="left"
            onPress={() => router.back()}
            style={{ marginTop: 0 }}
            textStyle={{ fontSize: 16 }}
          />
          {/* usa o recaregar tudo na pagina */}
          <ThemedButton
            title="Recarregar Página"
            icon={<Ionicons name="reload-outline" size={18} color="white" />}
            iconPosition="left"
            onPress={recarregarTudo}
            isLoading={loading}
            disabled={loading}
            style={{ marginTop: 0 }}
            textStyle={{ fontSize: 16 }}
          />
          {/* modal de confirmaçao */}
          <ConfirmacaoModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmAgendamento}
            servicoNome={servico.nome}
            data={formatDisplayDate(selectedDate)}
            horario={selectedHorario || ""}
            loading={sendLoading}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  dateContainer: {
    marginBottom: 15,
  },
  customDateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },

  // caso de data sem horario
  noHorariosContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    flexDirection: "column",
  },
  noHorariosText: {
    fontSize: 16,
    textAlign: "center",
  },

  // detalhes
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
});
