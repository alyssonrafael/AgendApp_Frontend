import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedButton } from "@/src/components/ThemedButton";
import { ThemedText } from "@/src/components/ThemedText";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMessage } from "@/src/context/MessageContext";
import api from "@/src/services/api";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { showMessage } = useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login/user", data);

      const { token } = response.data;
      await AsyncStorage.setItem("userToken", token);

      showMessage("success", "Login realizado com sucesso!");

      setTimeout(() => {
        router.replace("/(telasUsers)");
      }, 2000);
    } catch (error: any) {
      // Se a resposta da API existir, captura o status e faz o tratamento com os casos
      if (error.response) {
        const { status } = error.response;

        switch (status) {
          case 400:
            showMessage("alert", "Requisição inválida.");
            break;
          case 401:
            showMessage("danger", "Usuário ou senha incorretos.");
            break;
          case 403:
            showMessage("danger", "Acesso negado.");
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
    <View style={styles.containerText}>
      <ThemedText type="title" lightColor="#007BFF" darkColor="#4A90E2">
        ENTRE AGORA
      </ThemedText>
      <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
        Preencha os campos abaixo para o login
      </ThemedText>

      <View>
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

        <ThemedText style={styles.esqueci}>
          <ThemedText
            type="link"
            style={styles.link}
            onPress={() => router.push("/(auth)/recuperacao")}
          >
            Esqueci minha senha
          </ThemedText>
        </ThemedText>
      </View>

      <ThemedButton
        title="Login"
        onPress={handleSubmit(handleLogin)}
        isLoading={isLoading}
        disabled={isLoading} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerText: {
    alignItems: "center",
    marginTop: 30,
  },
  link: {
    color: "#007BFF",
  },
  esqueci: {
    textAlign: "right",
    textDecorationLine: "underline",
  },
});
