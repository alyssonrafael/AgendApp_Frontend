import { useMessage } from "@/src/context/MessageContext";
import api from "@/src/services/api";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ThemedButton } from "../ThemedButton";
import { View } from "react-native";
import { ThemedInput } from "../ThemedInput";
import { ThemedSelect } from "../ThemedSelect";

interface Recuperacao2FormData {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
  type: "user" | "empresa";
}

export default function Recuperacao2Form() {
  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useMessage();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Recuperacao2FormData>({
    defaultValues: {
      type: "user",
    },
  });

  const newPassword = watch("newPassword"); // Para validar a confirmação de senha

  const onSubmit = async (data: Recuperacao2FormData) => {
    try {
      setIsLoading(true);
      await api.post("/auth/reset-password", {
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
        type: data.type,
      });

      showMessage("success", "Senha redefinida com sucesso");

      if (data.type === "user") {
        setTimeout(() => {
          router.replace("/(auth)");
        }, 2000);
      } else {
        setTimeout(() => {
          router.replace("/(authEmpresa)");
        }, 2000);
      }
    } catch (error: any) {
      // Se a resposta da API existir, captura o status e faz o tratamento com os casos
      if (error.response) {
        const { status } = error.response;

        switch (status) {
          case 400:
            showMessage(
              "alert",
              "Não há código de recuperação para esse email!"
            );
            break;
          case 403:
            showMessage(
              "alert",
              "Código invalido ou expirado. solicite novamente o código de recuperação"
            );
            break;
          case 406:
            showMessage(
              "alert",
              "Houve um erro e não foi possivel alterar sua senha! Verifique os campos e tente novamente"
            );
            break;
          case 409:
            showMessage(
              "alert",
              "Sua conta de usuário foi resistrada com o Google por favor, verifique o tipo de usuario ou entre via Google "
            );
            break;
          case 500:
            showMessage(
              "danger",
              "Erro interno do servidor. Tente novamente mais tarde."
            );
            break;
          default:
            showMessage("danger", "Ocorreu um erro inesperado.");
            break;
        }
      } else if (error.request) {
        // O erro aconteceu, mas a API não respondeu
        showMessage(
          "danger",
          "Sem resposta do servidor. Verifique sua conexão."
        );
      } else {
        // Erro desconhecido
        showMessage("danger", "Erro inesperado ao processar sua solicitação.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={{ width: "90%" }}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "O e-mail é obrigatório",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Digite um e-mail válido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
              placeholder="Email"
              type="outlined"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="token"
          rules={{
            required: "O código de recuperação é obrigatório",
          }}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
              placeholder="Código de Recuperação"
              type="outlined"
              value={value}
              onChangeText={onChange}
              errorMessage={errors.token?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: "A nova senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter pelo menos 6 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
              placeholder="Nova senha"
              type="outlined"
              isPassword
              value={value}
              onChangeText={onChange}
              errorMessage={errors.newPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirme sua nova senha",
            validate: (value) =>
              value === newPassword || "As senhas não coincidem",
          }}
          render={({ field: { onChange, value } }) => (
            <ThemedInput
              placeholder="Confirme a nova senha"
              type="outlined"
              isPassword
              value={value}
              onChangeText={onChange}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <ThemedSelect
              selectedValue={value}
              onValueChange={onChange}
              options={[
                { label: "Usuário", value: "user" },
                { label: "Empresa", value: "empresa" },
              ]}
            />
          )}
        />
      </View>

      <ThemedButton
        title="Alterar senha"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </>
  );
}