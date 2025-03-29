import { useForm, Controller } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEmpresaServices } from "@/src/context/EmpresaServiceContext";
import { ThemedInput } from "@/src/components/ThemedInput";
import { useMessage } from "@/src/context/MessageContext";
import { useState } from "react";
import { ThemedButton } from "@/src/components/ThemedButton";
import { Ionicons } from "@expo/vector-icons";
import { ServiceNotFound } from "@/src/components/servicosComponents/ServiceNotFound";
import { ThemedLoadingIndicator } from "@/src/components/ThemedLoadingIndicator";

interface FormData {
  nome?: string;
  descricao?: string;
  duracao?: string;
  custo?: string;
}

export default function EdicaoServico() {
  // recupera o id do parametro
  const { id } = useLocalSearchParams();
  const { showMessage } = useMessage();

  const {
    services,
    loading,
    updateCusto,
    updateDescricao,
    updateDuracao,
    updateNome,
  } = useEmpresaServices();
  // definindo qual e o serviço que sera atualizado a partir do parametro recuperado do id
  const service = services.find((s) => s.id.toString() === id);
  // se loading
  if (loading) {
    return <ThemedLoadingIndicator message="Carregando serviço..." />;
  }
  // se nao encontrar o serviço
  if (!service) {
    return <ServiceNotFound />;
  }
  // valores iniciais ou seja os valores recuperados do serviço com o id recuperado
  const [initialValues, setInitialValues] = useState({
    nome: service?.nome?.toString() || "",
    descricao: service?.descricao?.toString() || "",
    duracao: service?.duracao?.toString() || "0",
    custo: service?.custo?.toString() || "0",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // valores iniciais do serviço a ser alterado
    defaultValues: {
      nome: service?.nome?.toString() || "",
      descricao: service?.descricao?.toString() || "",
      duracao: service?.duracao?.toString() || "0",
      custo: service?.custo?.toString() || "0",
    },
  });
  // função para salvar edições
  const handleSave = async (data: FormData) => {
    try {
      // Array para armazenar os campos atualizados para mostrar na mensagem
      const updatedFields: string[] = [];

      //atualiza o nome se for passado
      if (data.nome && data.nome !== initialValues.nome) {
        const nomeUpdated = await updateNome(id as string, data.nome);
        if (nomeUpdated) {
          updatedFields.push("Nome");
          setInitialValues((prev) => ({ ...prev, nome: data.nome || "" }));
        }
      }
      //atualiza o descricao se for passado
      if (data.descricao && data.descricao !== initialValues.descricao) {
        const descricaoUpdated = await updateDescricao(
          id as string,
          data.descricao
        );
        if (descricaoUpdated) {
          updatedFields.push("descrição");
          setInitialValues((prev) => ({
            ...prev,
            descricao: data.descricao || "",
          }));
        }
      }
      //atualiza o custo se for passado
      if (data.custo && data.custo !== initialValues.custo) {
        const custoNumber = parseFloat(data.custo.replace(",", ".")) || 0;
        const custoUpdated = await updateCusto(id as string, custoNumber);
        if (custoUpdated) {
          updatedFields.push("custo");
          setInitialValues((prev) => ({ ...prev, custo: data.custo || "0" }));
        }
      }
      //atualiza o duracao se for passado
      if (data.duracao && data.duracao !== initialValues.duracao) {
        const duracaoNumber = parseInt(data.duracao) || 0;
        const duracaoUpdated = await updateDuracao(id as string, duracaoNumber);
        if (duracaoUpdated) {
          updatedFields.push("duração");
          setInitialValues((prev) => ({
            ...prev,
            duracao: data.duracao || "0",
          }));
        }
      }
      // Exibe a mensagem de sucesso com base nos campos atualizados
      if (updatedFields.length > 0) {
        const camposAtualizados = updatedFields.join(", "); // Junta os campos em uma string
        showMessage(
          "success",
          `Os seguintes campos foram atualizados com sucesso: ${camposAtualizados}.`
        );
      } else {
        showMessage("info", "Nenhuma alteração foi feita.");
      }
      // reseta o formulario com os novos dados
      reset({
        nome: data.nome,
        descricao: data.descricao,
        custo: data.custo,
        duracao: data.duracao,
      });
    } catch (error: any) {
      // Tratamento de erros específicos que vem do contexto
      if (error.message === "Nome do serviço já existe.") {
        showMessage(
          "alert",
          "Nome do serviço já existe. Escolha outro nome. Nenhum campo atualizado"
        );
      } else {
        showMessage(
          "danger",
          error.message || "Erro ao atualizar informações."
        );
      }
    }
  };
  // reseta com os valores iniciais descartando qualquer dado editado sem enviar
  const handleReset = () => {
    reset(initialValues);
    showMessage("info", "Edição cancelada. Nenhum dado alterado");
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

        <ThemedText style={styles.label}>Descrição:</ThemedText>
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
              message: "Digite um valor válido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Ex: 50,00"
              type="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={(text) =>
                onChange(
                  text.replace(/[^0-9,]/g, "").replace(/(\..*)\./g, "$1")
                )
              }
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
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Ex: 30"
              type="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              errorMessage={errors.duracao?.message}
            />
          )}
        />


        {/* Botão para salvar as alterações */}
        <ThemedButton
          title={isSubmitting ? "Salvando..." : "Confirmar alterações"}
          onPress={handleSubmit(handleSave)}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          icon={<Ionicons name="checkmark-outline" size={25} color="#FFF" />}
          iconPosition="right"
          style={{ marginBottom: 2 }}
          textStyle={{ fontWeight: "300" }}
        />
        {/* Botão para resetar o formulario */}
        <ThemedButton
          title={"Cancelar alterações"}
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
