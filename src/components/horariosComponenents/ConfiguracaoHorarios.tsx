import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useGradeHorarios } from "@/src/context/GradeHorariosContext";
import { useMessage } from "@/src/context/MessageContext";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import CustomTimePicker from "./CustomTimePicker";

// interface com as propriedades de configuraçao de horario
interface ConfiguracaoHorario {
  id: string;
  diaSemana: number;
  inicio: string | null;
  fim: string | null;
  intervalo: number | null;
}
// interface com as propriedades de configuracao de horario do picker
interface PickerState {
  index: number | null;
  type: "inicio" | "fim" | null;
}
// interface com as propriedades de loading do componente
interface LoadingStates {
  saving: number | null; // Armazena o diaSemana que está salvando
  removing: number | null; // Armazena o diaSemana que está removendo
}

export default function ConfiguracaoHorarios() {
  // hooks e contextos
  const { showMessage } = useMessage();
  const { gradeHorarios, salvarGradeHorario, removerGradeHorario } =
    useGradeHorarios();
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoHorario[]>([]);
  const [selectedPicker, setSelectedPicker] = useState<PickerState>({
    index: null,
    type: null,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState<LoadingStates>({
    saving: null,
    removing: null,
  });

  // cor do tema para o fundo dos cards
  const cardsBackground = useThemeColor(
    { light: "#f5f5f5", dark: "#1e1e1e" },
    "backgroundCard"
  );
  // array com os dias da semana
  const diasDaSemana = [
    { id: 0, nome: "Domingo" },
    { id: 1, nome: "Segunda" },
    { id: 2, nome: "Terça" },
    { id: 3, nome: "Quarta" },
    { id: 4, nome: "Quinta" },
    { id: 5, nome: "Sexta" },
    { id: 6, nome: "Sábado" },
  ];

  // useEffect para preencher as configurações com os dados da grade de horários
  useEffect(() => {
    const configuracoesPreenchidas = diasDaSemana.map((dia) => {
      const existente = gradeHorarios?.find((g) => g.diaSemana === dia.id);
      return (
        existente || {
          id: `novo-${dia.id}`,
          diaSemana: dia.id,
          inicio: null,
          fim: null,
          intervalo: null,
        }
      );
    });
    setConfiguracoes(configuracoesPreenchidas);
  }, [gradeHorarios]);
  // função para lidar com a mudança de horário no picker
  const handleTimeChange = (
    time: Date | string | null,
    index: number,
    type: "inicio" | "fim"
  ) => {
    let formattedTime: string;
    if (typeof time === "string") {
      formattedTime = time;
    } else if (time instanceof Date) {
      formattedTime = time.toTimeString().slice(0, 5); // HH:mm
    } else {
      return;
    }
    // atualizaçao do estado de configuração
    setConfiguracoes((prev) => {
      const newConfig = [...prev];
      newConfig[index][type] = formattedTime;
      return newConfig;
    });
  };
  // função para lidar com a mudança de intervalo
  const handleIntervalChange = (index: number, interval: number) => {
    setConfiguracoes((prev) => {
      const novaLista = [...prev];
      novaLista[index].intervalo = interval;
      return novaLista;
    });
  };
  // funçao que usa do contexto a funçao para criar ou atualizar a configuraçao de uma grade
  const salvarConfiguracaoIndividual = async (config: ConfiguracaoHorario) => {
    if (!config.inicio || !config.fim || !config.intervalo) {
      showMessage("info", "Preencha todos os campos para salvar.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, saving: config.diaSemana }));

      await salvarGradeHorario({
        id: config.id,
        diaSemana: config.diaSemana,
        inicio: config.inicio,
        fim: config.fim,
        intervalo: config.intervalo,
      });

      showMessage(
        "success",
        `Configuração de " ${
          diasDaSemana.find((d) => d.id === config.diaSemana)?.nome
        } " salva com sucesso!`
      );
      // tratamento de erros especificos
    } catch (error: any) {
      if (
        error.response?.data?.error === "Start time must be before end time"
      ) {
        showMessage(
          "alert",
          "O horário de início deve ser antes do horário de fim"
        );
        return;
      }
      showMessage(
        "danger",
        "Ocorreu um erro ao salvar a configuração. verifique os dados e tente novamente em caso de persistência contate o suporte"
      );
    } finally {
      setLoading((prev) => ({ ...prev, saving: null }));
    }
  };
  // funçao que usa do contexto a funçao para remover uma grade de horario
  const removerConfiguracaoIndividual = async (config: ConfiguracaoHorario) => {
    try {
      setLoading((prev) => ({ ...prev, removing: config.diaSemana }));

      await removerGradeHorario(config.diaSemana);
      setConfiguracoes((prev) =>
        prev.map((item) =>
          item.diaSemana === config.diaSemana
            ? { ...item, inicio: null, fim: null, intervalo: null }
            : item
        )
      );
      showMessage("success", "Configuração removida com sucesso!");
      // tratamento de erros especificos
    } catch (error: any) {
      if (
        error.response?.data?.error ===
        "Cannot remove day as there are future appointments"
      ) {
        showMessage(
          "alert",
          "Não é possível remover o dia, pois há agendamentos registrados nele. Você pode gerar uma indisponibilidade para ele!"
        );
        return;
      }
      showMessage("danger", "Erro ao remover o dia. Verifique sua conexão.");
    } finally {
      setLoading((prev) => ({ ...prev, removing: null }));
    }
  };
  // componente das configuraçoes da grade
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Mapeia cada configuração de horário para renderizar um card */}
      {configuracoes.map((config, index) => {
        // Encontra o nome do dia da semana baseado no ID ou usa um fallback
        const nomeDia =
          diasDaSemana.find((d) => d.id === config.diaSemana)?.nome ??
          `Dia ${config.diaSemana}`;
        // Verifica se a configuração está completa (tem início, fim e intervalo)
        const estaConfigurado = config.inicio && config.fim && config.intervalo;
        // Verifica se é uma configuração nova (ID começa com "novo-")
        const ehNovo = config.id.startsWith("novo-");

        return (
          <ThemedView
            key={config.id}
            style={[
              styles.section,
              !estaConfigurado && { opacity: 0.5 }, // Opacidade reduzida se não estiver configurado
              { backgroundColor: cardsBackground },
            ]}
          >
            <ThemedText type="defaultSemiBold">{nomeDia}</ThemedText>
            {/* Se estiver configurado, mostra os horários e intervalos */}
            {estaConfigurado ? (
              <>
                <View style={styles.horarioRow}>
                  <ThemedText>Início:</ThemedText>
                  <TouchableOpacity
                    style={styles.timeButton}
                    // define qual e o piker e mostra o modal com o piker personalizado
                    onPress={() => {
                      setSelectedPicker({ index, type: "inicio" });
                      setShowPicker(true);
                    }}
                  >
                    <ThemedText>{config.inicio}</ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={styles.horarioRow}>
                  <ThemedText>Fim:</ThemedText>
                  <TouchableOpacity
                    style={styles.timeButton}
                    // define qual e o piker e mostra o modal com o piker personalizado
                    onPress={() => {
                      setSelectedPicker({ index, type: "fim" });
                      setShowPicker(true);
                    }}
                  >
                    <ThemedText>{config.fim}</ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Seletor de intervalos (15, 30, 45 ou 60 minutos) */}
                <ThemedText style={{ marginTop: 10 }}>
                  Intervalo entre horários (min):
                </ThemedText>
                <View style={styles.intervalosContainer}>
                  {[15, 30, 45, 60].map((interval) => (
                    <TouchableOpacity
                      key={interval}
                      style={[
                        styles.intervaloButton,
                        config.intervalo === interval &&
                          styles.intervaloSelecionado,
                      ]}
                      onPress={() => handleIntervalChange(index, interval)}
                    >
                      <ThemedText>{interval}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              // Se não estiver configurado, mostra botão para adicionar
              <TouchableOpacity
                onPress={() => {
                  // Cria uma cópia do array e define valores padrão
                  const novaLista = [...configuracoes];
                  novaLista[index].inicio = "08:00";
                  novaLista[index].fim = "18:00";
                  novaLista[index].intervalo = 30;
                  setConfiguracoes(novaLista);
                }}
              >
                <ThemedText style={{ color: "#007AFF" }}>
                  + Adicionar configuração
                </ThemedText>
              </TouchableOpacity>
            )}
            {/* Seletor de hora (aparece quando um horário é clicado) mosta p time picker personalizado */}
            {selectedPicker.index === index && selectedPicker.type && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomTimePicker
                  visible={showPicker}
                  onClose={() => setShowPicker(false)}
                  onTimeSelected={(time) => {
                    if (selectedPicker.type) {
                      handleTimeChange(time, index, selectedPicker.type);
                    }
                    setShowPicker(false);
                  }}
                  initialTime={
                    selectedPicker.index !== null && selectedPicker.type
                      ? configuracoes[selectedPicker.index][selectedPicker.type] ?? "08:00"
                      : "08:00"
                  }
                  
                />
              </View>
            )}
            {/* Botões de ação (aparecem quando configurado) */}
            {estaConfigurado && (
              <View style={styles.actionsContainer}>
                {ehNovo && (
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => {
                      // Reseta os valores da configuração atual
                      setConfiguracoes((prev) =>
                        prev.map((item) =>
                          item.diaSemana === config.diaSemana
                            ? {
                                ...item,
                                inicio: null,
                                fim: null,
                                intervalo: null,
                              }
                            : item
                        )
                      );
                    }}
                  >
                    <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                  </TouchableOpacity>
                )}

                {/* Botão Remover - só aparece para configurações já salvas */}
                {!ehNovo && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.deleteButton,
                      loading.removing === config.diaSemana &&
                        styles.buttonDisabled,
                    ]}
                    onPress={() => removerConfiguracaoIndividual(config)}
                    disabled={loading.removing === config.diaSemana}
                  >
                    {loading.removing === config.diaSemana ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <ThemedText style={styles.buttonText}>Remover</ThemedText>
                    )}
                  </TouchableOpacity>
                )}
                {/* Botão Salvar - sempre visível quando configurado */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    loading.saving === config.diaSemana &&
                      styles.buttonDisabled,
                  ]}
                  onPress={() => salvarConfiguracaoIndividual(config)}
                  disabled={loading.saving === config.diaSemana}
                >
                  {loading.saving === config.diaSemana ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.buttonText}>Salvar</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ThemedView>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horarioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  timeButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    minWidth: 90,
    alignItems: "center",
  },
  intervalosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  intervaloButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "23%",
    alignItems: "center",
  },
  intervaloSelecionado: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    flex: 1,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
