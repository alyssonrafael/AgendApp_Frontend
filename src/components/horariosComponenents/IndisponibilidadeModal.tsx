import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  ActivityIndicator,
} from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker, {
  EvtTypes,
} from "@react-native-community/datetimepicker";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import { useMessage } from "@/src/context/MessageContext";
import { useGradeHorarios } from "@/src/context/GradeHorariosContext";

type FormData = {
  inicio: string; // Horário de início da indisponibilidade
  fim: string; // Horário de fim da indisponibilidade
  motivo?: string; // Motivo opcional da indisponibilidade
  data: string; // Data específica da indisponibilidade
  isGlobal: boolean; // Define se a indisponibilidade é global (recorrente)
};

interface IndisponibilidadeModalProps {
  visible: boolean; // Define se o modal está visível
  onClose: () => void; // Função chamada ao fechar o modal
  onSuccess: () => void; // Função chamada ao salvar com sucesso
}

export const IndisponibilidadeModal: React.FC<IndisponibilidadeModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  // Estados para controle da UI
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFimPicker, setShowFimPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Hooks customizados para exibir mensagens e criar indisponibilidades
  const { showMessage } = useMessage();
  const { createIndisponibilidade } = useGradeHorarios();

  // cores personalizadas conforme o tema
  const timeButtonBackground = useThemeColor(
    { light: "#F7F7F7", dark: "#121212" },
    "background"
  );
  const timeButtonBorderColor = useThemeColor(
    { light: "#49454F", dark: "#A3A3A3" },
    "tint"
  );

  // configuraçao do hookform
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      inicio: "12:00",
      fim: "13:00",
      motivo: "",
      data: "",
      isGlobal: false,
    },
  });

  const isGlobal = watch("isGlobal"); // Observa a mudança do estado global

  // Função para salvar a indisponibilidade
  const handleSave = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      await createIndisponibilidade({
        inicio: formData.inicio,
        fim: formData.fim,
        motivo: formData.motivo,
        data: formData.isGlobal ? null : formData.data,
      });

      reset();
      onClose();
      onSuccess?.();
      showMessage("success", "Indisponibilidade criada com sucesso!");
    } catch (error: any) {
      // Tratamento de erros específicos
      if (
        error.response?.data?.error?.includes("Unavailability already exists")
      ) {
        setErrorMessage("Já existe uma indisponibilidade para este horário");
      } else if (
        error.response?.data?.error?.includes(
          "Start time must be before end time"
        )
      ) {
        setErrorMessage(
          "O horário de início deve ser anterior ao horário de fim"
        );
      } else {
        setErrorMessage("Erro ao criar indisponibilidade");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Função para atualizar os horários selecionados
  const handleTimeChange = (
    _event: {
      type: EvtTypes;
      nativeEvent: { timestamp: number; utcOffset: number };
    },
    selectedTime: Date | undefined,
    type: "inicio" | "fim"
  ) => {
    if (type === "inicio") {
      setShowInicioPicker(false);
    } else {
      setShowFimPicker(false);
    }

    if (selectedTime) {
      const horas = selectedTime.getHours().toString().padStart(2, "0");
      const minutos = selectedTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${horas}:${minutos}`;
      setValue(type, timeString, { shouldValidate: true });
    }
  };
  // Validação para o campo de data
  const validateData = (value: string) => {
    if (isGlobal) return true;
    if (!value) return "Data é obrigatória quando não for global";

    const [day, month, year] = value.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime()) || "Data inválida (use DD-MM-AAAA)";
  };

  if (!visible) return null; // Retorna null caso o modal não esteja visível

  return (
    // modal de criaçao de indisponibilidae
    <Modal animationType="fade" transparent={true} statusBarTranslucent={true}>
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            Nova Indisponibilidade
          </ThemedText>
          {errorMessage && (
            <View style={styles.errorMessageContainer}>
              <ThemedText style={styles.errorMessageText}>
                {errorMessage}
              </ThemedText>
            </View>
          )}
          <View style={styles.switchContainer}>
            <ThemedText>Indisponibilidade Global:</ThemedText>
            <Controller
              control={control}
              name="isGlobal"
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#767577", true: "#34C759" }}
                  thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
                />
              )}
            />
          </View>
          {/* se global for true informa oq sera uma indisponibilidade global */}
          {isGlobal && (
            <ThemedText style={{ marginBottom: 15, textAlign: "center" }}>
              A indisponibilidade global é recorrente e acontecerá todos os dias
            </ThemedText>
          )}
          {/* se global for falso exibe o input de data */}
          {!isGlobal && (
            <Controller
              control={control}
              name="data"
              rules={{ validate: validateData }}
              render={({ field: { onChange, value } }) => (
                <ThemedInput
                  type="outlined"
                  placeholder="Data (DD-MM-AAAA)"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.data?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="motivo"
            rules={{
              maxLength: {
                value: 40,
                message: "Máximo 40 caracteres",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                type="outlined"
                placeholder="Motivo (opcional - ex: Horário de descanso)"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.motivo?.message}
              />
            )}
          />

          <View
            style={[styles.timeRow, { backgroundColor: timeButtonBackground }]}
          >
            <ThemedText>Início:</ThemedText>
            <Controller
              control={control}
              name="inicio"
              rules={{ required: "Horário de início é obrigatório" }}
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.timeButton,
                      { borderColor: timeButtonBorderColor },
                    ]}
                    onPress={() => setShowInicioPicker(true)}
                    disabled={isLoading}
                  >
                    <ThemedText>{value}</ThemedText>
                  </TouchableOpacity>
                  {errors.inicio && (
                    <ThemedText style={styles.errorText}>
                      {errors.inicio.message}
                    </ThemedText>
                  )}
                </>
              )}
            />
          </View>
          {/* exibe o piker de horario */}
          {showInicioPicker && (
            <DateTimePicker
              value={new Date(`1970-01-01T${watch("inicio")}:00`)}
              mode="time"
              display="default"
              onChange={(event, time) =>
                handleTimeChange(event, time, "inicio")
              }
            />
          )}

          <View
            style={[styles.timeRow, { backgroundColor: timeButtonBackground }]}
          >
            <ThemedText>Fim:</ThemedText>
            <Controller
              control={control}
              name="fim"
              rules={{ required: "Horário de fim é obrigatório" }}
              render={({ field: { value } }) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.timeButton,
                      { borderColor: timeButtonBorderColor },
                    ]}
                    onPress={() => setShowFimPicker(true)}
                    disabled={isLoading}
                  >
                    <ThemedText>{value}</ThemedText>
                  </TouchableOpacity>
                  {errors.fim && (
                    <ThemedText style={styles.errorText}>
                      {errors.fim.message}
                    </ThemedText>
                  )}
                </>
              )}
            />
          </View>
          {/* exibe o piker de horario */}
          {showFimPicker && (
            <DateTimePicker
              value={new Date(`1970-01-01T${watch("fim")}:00`)}
              mode="time"
              display="default"
              onChange={(event, time) => handleTimeChange(event, time, "fim")}
            />
          )}

          <View style={styles.buttonRow}>
            {/* botao de confirmar criaçao */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={() => {
                onClose(), setErrorMessage(null), reset();
              }}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            {/* botao de cancelar */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleSubmit(handleSave)}
              disabled={isLoading}
            >
              {/* loading se a req estiver sendo processada */}
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.buttonText}>Salvar</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
  },
  errorMessageContainer: {
    padding: 12,
    alignItems: "center",
  },
  errorMessageText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
});
