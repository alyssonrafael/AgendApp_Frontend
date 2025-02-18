import { Alert, View } from "react-native";
import React from "react";
import { ThemedOptionItem } from "../ThemedOptionItem";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SessaoUsuario() {
  // Função para remover o token do usuário
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
    } catch (error) {
      console.error("Erro ao remover token:", error);
    }
  };

  const sair = () => {
    // Se estiver em qualquer outra tela principal, remover token e voltar para login
    Alert.alert("Sair do aplicativo", "Deseja voltar para a tela de login?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          await removeToken(); // Remove o token antes de redirecionar
          router.replace("/(auth)");
        },
      },
    ]);
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <ThemedOptionItem
        iconName="eye-outline"
        text="Ver perfil"
        onPress={() => {
          router.push("/(telasUsers)/(maisOpcoes)/perfil");
        }}
      />
      <ThemedOptionItem
        iconName="pencil-outline"
        text="Editar Perfil"
        onPress={() => {
          router.push("/(telasUsers)/(maisOpcoes)/editarPerfil");
        }}
      />
      <ThemedOptionItem
        iconName="log-out-outline"
        text="Fazer Logout"
        onPress={() => {
          sair();
        }}
      />
    </View>
  );
}
