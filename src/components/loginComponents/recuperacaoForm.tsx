import api from "@/src/services/api";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {  View } from "react-native";
import { ThemedInput } from "../ThemedInput";
import { ThemedButton } from "../ThemedButton";
import { useMessage } from "@/src/context/MessageContext";

interface RecuperacaoFormData {
  email: string;
}

export default function RecuperacaoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useMessage();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperacaoFormData>();

  const handlePress = async (data: RecuperacaoFormData) => {
    setIsLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: data.email,
      });
      let time;

      if (response.status === 200) {
        showMessage(
          "success",
          "Código de recuperação enviado para seu e-mail!"
        );
        time = 2000;
      }
      if (response.status === 207) {
        showMessage(
          "info",
          "Esse Email Possui conta de Usuário e Empresa. Na próxima etapa selecione de qual conta você quer alterar a senha!"
        );
        time = 4000;
      }

      setTimeout(() => {
        router.push("/(auth)/recuperacao2");
      }, time);
    } catch (error: any) {
      // Se a resposta da API existir, captura o status e faz o tratamento com os casos
      if (error.response) {
        const { status } = error.response;

        switch (status) {
          case 400:
            showMessage(
              "alert",
              "O cadastro desse Email foi feito pelo Google! Volte para o login e realize seu acesso."
            );
            break;
          case 404:
            showMessage(
              "alert",
              "Ocorreu erro ao enviar o código de recuperação verifique se seu Email esta correto"
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
      {/* Campo de e-mail */}
      <View style={{ width: "100%" }}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "O e-mail é obrigatório",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "E-mail inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <ThemedInput
                placeholder="Email"
                type="outlined"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            </>
          )}
        />
      </View>

      <ThemedButton
        title="Enviar"
        onPress={handleSubmit(handlePress)}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </>
  );
}
