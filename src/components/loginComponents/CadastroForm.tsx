import api from "@/src/services/api";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { ThemedInput } from "../ThemedInput";
import { ThemedButton } from "../ThemedButton";
import { useMessage } from "@/src/context/MessageContext";

interface CadastroFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CadastroForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useMessage();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<CadastroFormData>();

  const handlePress = async (data: CadastroFormData) => {
    setIsLoading(true);

    try {
      await api.post("/auth/register/user", data);
      showMessage("success", "Cadastro bem sucedido, Redirecionando para o login!");
      setTimeout(() => {
        router.replace("/(auth)");
      }, 2000);
    } catch (error: any) {
      // Se a resposta da API existir, captura o status e faz o tratamento com os casos
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 400:
            showMessage("alert", "Requisição inválida.");
            break;
          case 409:
            showMessage(
              "alert",
              "Confirme os dados do cadastro, Seu email já pode estar cadastrado!"
            );
            break;
          case 404:
            showMessage("alert", "Recurso não encontrado.");
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
      <View>
        <Controller
          control={control}
          name="name"
          rules={{ required: "O nome é obrigatório" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Nome"
              type="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "O email é obrigatório",
            pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Email"
              type="outlined"
              keyboardType="email-address"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "A senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter pelo menos 6 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Senha"
              type="outlined"
              isPassword
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Por favor, confirme a sua senha",
            validate: (value) =>
              value === getValues("password") || "As senhas não coincidem", // Usando getValues aqui para comparar as senhas
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              placeholder="Confirme a senha"
              type="outlined"
              isPassword
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />
      </View>
      <ThemedButton
        title="Cadastre-se"
        onPress={handleSubmit(handlePress)}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </>
  );
}
