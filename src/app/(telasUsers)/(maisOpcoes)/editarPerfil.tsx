import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedButton } from "@/src/components/ThemedButton";
import { useUser } from "@/src/context/UserContext";
import { ThemedInput } from "@/src/components/ThemedInput";
import { useMessage } from "@/src/context/MessageContext";
import { ThemedView } from "@/src/components/ThemedView";

// Define o tipo dos dados do formulário
interface FormData {
  name?: string;
  password?: string;
  newPassword?: string;
  phoneNumber?: string;
  confirmNewPassword?: string;
}

export default function EditarPerfil() {
  // pega as informaçoes do usuário e as funções de atualização do contexto
  const {
    user,
    loading,
    updateUserName,
    updateUserPassword,
    updateUserPhoneNumber,
  } = useUser();
  const { showMessage } = useMessage();

  // Configuração do formulário usando react-hook-form
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || "", // Inicializa o campo de nome com o nome atual do usuário
      phoneNumber: user?.phoneNumber || "", // Inicializa o campo de telefone com o telefone atual do usuário
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Função de envio do formulário
  const handleSave = async (data: FormData) => {
    // Verifica se não houve nenhuma alteração
    if (
      data.name === user?.name &&
      !data.password?.trim() &&
      !data.newPassword?.trim() &&
      !data.confirmNewPassword?.trim() &&
      !data.phoneNumber?.trim()
    ) {
      showMessage("info", "Nenhuma alteração foi feita.");
      return;
    }

    // Validações adicionais para a troca de senha
    if (data.password && !data.newPassword) {
      showMessage("alert", "Preencha a nova senha!");
      return;
    }

    if (data.newPassword && !data.password) {
      showMessage("alert", "Preencha sua senha!");
      return;
    }

    if (
      data.newPassword &&
      data.newPassword !== getValues("confirmNewPassword")
    ) {
      showMessage("alert", "As novas senhas não coincidem!");
      return;
    }

    try {
      const updatedFields: string[] = []; // Array para armazenar os campos atualizados

      // Atualiza o nome, se tiver sido alterado
      if (data.name && data.name !== user?.name) {
       const nameUpdated = await updateUserName(data.name);
        if (nameUpdated) updatedFields.push("nome");
      }
      
      //atualiza o telefone, se informado
      if (data.phoneNumber && data.phoneNumber !== user?.phoneNumber) {
       const phoneNumberUpdated = await updateUserPhoneNumber(data.phoneNumber);
        if (phoneNumberUpdated) updatedFields.push("telefone");
      }

      // Atualiza a senha, se informada
      if (data.password && data.newPassword) {
        const passwordUpdated = await updateUserPassword(
          data.password,
          data.newPassword
        );
        if (passwordUpdated) updatedFields.push("senha");
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

      // Reseta o formulário, mantendo o nome atualizado
      reset({
        name: data.name,
        phoneNumber: data.phoneNumber,
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      showMessage("danger", error.error || "Erro ao atualizar informações.");
    }
  };

  //se loading exibe o indicativo
  if (loading) {
    return (
      <ThemedView style={styles.containerloading}>
        <ActivityIndicator size="large" color="#007BFF" />
        <ThemedText>Carregando seu perfil...</ThemedText>
      </ThemedView>
    );
  }
  // se nao consguir o user exibe essa tela indicando o erro
  if (!user) {
    return (
      <ThemedView style={styles.containerloading}>
        <ThemedText style={styles.errorText}>
          Erro ao carregar o perfil. Tente novamente.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
      >
      <View style={{ width: "100%" }}>
        {/* Campo para alterar o nome */}
        <ThemedText style={styles.label}>Alterar Nome</ThemedText>
        <Controller
          control={control}
          name="name"
          rules={{
            minLength: {
              value: 3,
              message: "O nome deve ter pelo menos 3 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              value={value}
              type="outlined"
              placeholder="Digite seu novo nome"
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              errorMessage={errors.name?.message}
            />
          )}
        />
        </View>
      <View style={{ width: "100%" }}>
        {/* Campo para alterar o telefone */}
        <ThemedText style={styles.label}>Alterar Número</ThemedText>
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: "O número de telefone é obrigatório",
            minLength: {
              value: 10,
              message: "O número deve ter no mínimo 10 dígitos",
            },
            maxLength: {
              value: 15,
              message: "O número deve ter no máximo 15 dígitos",
            },
            pattern: {
              value: /^\+?\d{10,15}$/,
              message: "Número inválido. Apenas números, com opcional '+'.",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              value={value}
              type="outlined"
              placeholder="Digite seu novo telefone"
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
              autoCapitalize="none"
              errorMessage={errors.phoneNumber?.message}
            />
          )}
        />

        {/* Campo para senha atual */}
        <ThemedText style={styles.label}>Senha atual</ThemedText>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Digite sua senha atual"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              type="outlined"
              isPassword
              errorMessage={errors.password?.message}
            />
          )}
        />

        {/* Campo para nova senha */}
        <ThemedText style={styles.label}>Nova Senha</ThemedText>
        <Controller
          control={control}
          name="newPassword"
          rules={{
            minLength: {
              value: 6,
              message: "A senha deve ter pelo menos 6 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Digite sua nova senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              type="outlined"
              isPassword
            />
          )}
        />

        {/* Campo para confirmar a nova senha */}
        <ThemedText style={styles.label}>Confirme sua nova senha</ThemedText>
        <Controller
          control={control}
          name="confirmNewPassword"
          rules={{
            validate: (value) =>
              value === getValues("newPassword") || "As senhas não coincidem",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Confirme a nova senha"
              type="outlined"
              isPassword
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.confirmNewPassword?.message}
            />
          )}
        />
      </View>

      {/* Botão de confirmação */}
      <ThemedButton
        title="Confirmar alterações"
        onPress={handleSubmit(handleSave)}
        isLoading={isSubmitting}
      />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "flex-start",
    padding: 20,
  },
  containerloading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});
