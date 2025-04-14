import React, { useState } from "react";
import { router } from "expo-router";
import { ScrollView, View, StyleSheet } from "react-native";
import { ThemedText } from "../../ThemedText";
import { ThemedButton } from "../../ThemedButton";
import { ThemedLoadingIndicator } from "../../ThemedLoadingIndicator";
import { Ionicons } from "@expo/vector-icons";
import DateSelector from "./DataSelector";
import TimeSlotGrid from "./TimeSlotGrid";
import TimeSlotModal from "./TimeSlotModal";
import { useAgendamentos } from "../../../context/AgendamentosEmpresaContext";
import {HorarioDisponivel, useGradeHorarios} from "../../../context/GradeHorariosContext";

// Componente principal da tabela de horários
const TabelaDeHorarios: React.FC = () => {
  // Contexto de agendamentos - fornece a lista de agendamentos e função para selecionar
  const { agendamentos, setAgendamentoSelecionado } = useAgendamentos();
  
  // Contexto de grade de horários - fornece horários disponíveis, data selecionada, etc.
  const {
    horariosDisponiveis,  // Objeto com horários disponíveis por data
    selectedDate,          // Data atualmente selecionada
    loading,               // Estado de carregamento
    setSelectedDate,       // Função para alterar a data selecionada
    getGradeForDay,        // Função para obter a grade de um dia específico
    refreshHorarios,       // Função para recarregar os horários
  } = useGradeHorarios();

  // Estados do componente
  const [modalVisible, setModalVisible] = useState<boolean>(false);  // Controla visibilidade do modal
  const [selectedHorario, setSelectedHorario] = useState<HorarioDisponivel | null>(null);  // Horário selecionado
  const [agendamentoNoHorario, setAgendamentoNoHorario] = useState<any>(null);  // Agendamento no horário selecionado

  // Função para encontrar um agendamento em um horário específico
  const findAgendamentoNoHorario = (data: string, horario: string) => {
    if (!data || !horario) return null;

    // Converte a data para ano, mês e dia
    const [year, month, day] = data.split("-").map(Number);
    // Converte o horário para minutos totais
    const [horaBuscada, minutoBuscado] = horario.split(":").map(Number);
    const minutosBuscados = horaBuscada * 60 + minutoBuscado;

    // Procura um agendamento que corresponda à data e horário
    return agendamentos.find((ag) => {
      // Ajusta a data do agendamento para o fuso horário local
      const agDate = new Date(ag.data);
      const agDateLocal = new Date(
        agDate.getUTCFullYear(),
        agDate.getUTCMonth(),
        agDate.getUTCDate()
      );

      // Verifica se é o mesmo dia
      const mesmoDia =
        agDateLocal.getFullYear() === year &&
        agDateLocal.getMonth() === month - 1 &&
        agDateLocal.getDate() === day;

      if (!mesmoDia) return false;

      // Verifica se o horário está dentro da duração do agendamento
      const [horaAg, minutoAg] = ag.horario.split(":").map(Number);
      const minutosAgendamento = horaAg * 60 + minutoAg;
      return (
        minutosBuscados >= minutosAgendamento &&
        minutosBuscados < minutosAgendamento + ag.servico.duracao
      );
    });
  };

  // Função chamada quando um horário é pressionado
  const handleHorarioPress = (horario: HorarioDisponivel) => {
    // Encontra o agendamento no horário selecionado
    const agendamento = findAgendamentoNoHorario(selectedDate!, horario.horario);
    // Atualiza os estados com as informações encontradas
    setAgendamentoSelecionado(agendamento || null);
    setAgendamentoNoHorario(agendamento);
    setSelectedHorario(horario);
    setModalVisible(true);  // Abre o modal
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setAgendamentoSelecionado(null);
    setSelectedHorario(null);
    setAgendamentoNoHorario(null);
  };

  // Mostra indicador de carregamento se os dados estiverem sendo carregados
  if (loading) {
    return <ThemedLoadingIndicator message="Carregando Horários" />;
  }

  // Mostra mensagem especial se não houver horários disponíveis
  if (!horariosDisponiveis || Object.keys(horariosDisponiveis).length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ThemedText style={styles.emptyText}>
          Não há horários disponíveis. Você pode atualizar sua grade de horários
          para disponibilizar dias e horarios para sua empresa.
        </ThemedText>
        <ThemedButton
          icon={<Ionicons name="cog-outline" size={22} color="white" />}
          iconPosition="left"
          title="Atualizar Grade"
          onPress={() => {
            router.push("/(telasEmpresas)/(horarios)/gerenciarGrade");
          }}
        />
      </View>
    );
  }

  // Renderização principal do componente
  return (
    <View style={styles.container}>
      {/* Seção superior com cabeçalho e seletor de datas */}
      <View style={styles.topSection}>
        <ThemedText style={styles.headerText}>
          Selecione um dia para visualizar os horários disponíveis. Para ver
          mais dias, acesse "Todos os Agendamentos".
        </ThemedText>
        
        {/* Seletor de datas */}
        <View>
          <DateSelector
            dates={Object.keys(horariosDisponiveis)}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </View>
        
        {/* Lista de horários */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {selectedDate && (
            <>
              {/* Verifica se há horários para a data selecionada */}
              {horariosDisponiveis[selectedDate]?.length === 0 ? (
                <View>
                  <ThemedText style={styles.emptyText}>
                    Não há horários disponíveis para este dia. Voce pode
                    atualizr sua grade de horários
                  </ThemedText>
                  <ThemedButton
                    icon={<Ionicons name="cog-outline" size={22} color="white" />}
                    iconPosition="left"
                    title="Gerenciar Grade"
                    onPress={() => {
                      router.push("/(telasEmpresas)/(horarios)/gerenciarGrade");
                    }}
                  />
                </View>
              ) : (
                // grade de horarios para o dia seleconado no seletor
                <TimeSlotGrid
                  horarios={horariosDisponiveis[selectedDate]}
                  gradeDoDia={getGradeForDay(selectedDate)}
                  selectedDate={selectedDate}
                  onHorarioPress={handleHorarioPress}
                />
              )}
            </>
          )}
        </ScrollView>
      </View>
      
      {/* Botão para recarregar horários */}
      <ThemedButton
        title="Recaregar Horários"
        iconPosition="left"
        icon={<Ionicons name="refresh" size={22} color="white" />}
        onPress={refreshHorarios}
        isLoading={loading}
        style={{ marginTop: 8, marginBottom: 0 }}
      />
      
      {/* Modal que mostra detalhes do horário selecionado */}
      <TimeSlotModal
        visible={modalVisible}
        onClose={handleCloseModal}
        selectedHorario={selectedHorario}
        selectedDate={selectedDate}
        agendamentoNoHorario={agendamentoNoHorario}
      />
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    paddingHorizontal: 6,
    gap: 4,
  },
  headerText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});

export default TabelaDeHorarios;