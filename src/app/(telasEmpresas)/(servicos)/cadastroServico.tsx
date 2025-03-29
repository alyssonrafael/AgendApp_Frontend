import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useEmpresaServices } from "@/src/context/EmpresaServiceContext";
import { useMessage } from "@/src/context/MessageContext";
import { ThemedButton } from "@/src/components/ThemedButton";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedText } from "@/src/components/ThemedText";

type CreateServiceData = {
  nome: string;
  descricao: string;
  duracao: string;
  custo: string;
};

export default function cadastroServico() {
  const { createService } = useEmpresaServices();
  const router = useRouter();
  const { showMessage } = useMessage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceData>({
    defaultValues: {
      nome: "",
      descricao: "",
      custo: "",
      duracao: "30",
    },
  });

  const onSubmit = async (data: CreateServiceData) => {
    try {
      // Converter valores para número antes de enviar
      const serviceData = {
        nome: data.nome,
        descricao: data.descricao,
        duracao: parseInt(data.duracao) || 30, // Valor padrão 30 se conversão falhar
        custo: parseFloat(data.custo.replace(",", ".")) || 0, // Converte vírgula para ponto
      };
      const newService = await createService(serviceData);

      if (newService) {
        showMessage("success", "Serviço criado com sucesso!");
        setTimeout(() => router.back(), 1500); // Volta após ver a mensagem
      }
    } catch (error: any) {
      showMessage("danger", error.message || "Erro ao cadastar serviço");
    }
  };

  const handleReset = () => {
    reset({
      nome: "",
      descricao: "",
      custo: "",
      duracao: "30",
    });
    showMessage("info", "Criação cancelada.");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label}>Nome do Serviço:</ThemedText>
        <Controller
          control={control}
          name="nome"
          rules={{
            required: "O nome do serviço é obrigatório",
            minLength: {
              value: 5,
              message: "O nome deve ter no mínimo 5 caracteres",
            },
            maxLength: {
              value: 100,
              message: "O nome deve ter no máximo 100 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Nome do serviço"
              type="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.nome?.message}
            />
          )}
        />

        <ThemedText style={styles.label}>Descrição do serviço:</ThemedText>
        <Controller
          control={control}
          name="descricao"
          rules={{
            required: "A descrição é obrigatória",
            minLength: {
              value: 10,
              message: "A descrição deve ter no mínimo 10 caracteres",
            },
            maxLength: {
              value: 200,
              message: "A descrição deve ter no máximo 200 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Descrição do serviço"
              type="big"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline
              numberOfLines={5}
              style={styles.multilineInput}
              errorMessage={errors.descricao?.message}
            />
          )}
        />
        <ThemedText style={styles.label}>Preço (R$):</ThemedText>
        <Controller
          control={control}
          name="custo"
          rules={{
            required: "O preço é obrigatório",
            pattern: {
              value: /^[0-9]+([,.][0-9]{1,2})?$/,
              message: "Digite um valor válido (ex: 50,00)",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Ex: 50,00"
              type="outlined"
              value={value.toString()} // Garante que é string
              onBlur={onBlur}
              onChangeText={(text) => {
                // Permite apenas números e uma vírgula no formto 50,00
                const formattedText = text
                  .replace(/[^0-9,]/g, "")
                  .replace(/(,.*),/g, "$1");
                onChange(formattedText);
              }}
              keyboardType="decimal-pad"
              errorMessage={errors.custo?.message}
            />
          )}
        />
        <ThemedText style={styles.label}>Duração (minutos):</ThemedText>
        <Controller
          control={control}
          name="duracao"
          rules={{
            required: "A duração é obrigatória",
            pattern: {
              value: /^\d+$/,
              message: "Digite apenas números",
            },
            min: {
              value: 1,
              message: "Duração mínima de 1 minuto",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Ex: 30"
              type="outlined"
              value={value.toString()} // Garante que é string
              onBlur={onBlur}
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              errorMessage={errors.duracao?.message}
            />
          )}
        />

        {/* Botão para salvar as alterações */}
        <ThemedButton
          title={isSubmitting ? "Salvando..." : "Cadastrar novo serviço"}
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          icon={<Ionicons name="checkmark-outline" size={25} color="#FFF" />}
          iconPosition="right"
          style={{ marginBottom: 2 }}
          textStyle={{ fontWeight: "300" }}
        />
        {/* Botão para cancelar as alterações */}
        <ThemedButton
          title={"Cancelar criação"}
          onPress={handleReset}
          icon={<Ionicons name="close-circle-outline" size={25} color="#FFF" />}
          iconPosition="right"
          style={{ backgroundColor: "red" }}
          textStyle={{ fontWeight: "300" }}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: "bold",
  },
  multilineInput: {
    minHeight: 100,
    maxHeight: 200,
    textAlignVertical: "top",
  },
});
