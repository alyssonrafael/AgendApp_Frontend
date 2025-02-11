import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { router } from "expo-router";
import { ThemedButton } from "@/src/components/ThemedButton";
import { Logo } from "@/src/components/ThemedLogo";

export default function LoginEmpresaScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Ação concluída!");
    }, 2000);

    router.replace("/(telasEmpresas)");
  };

  return (
    <ThemedView style={styles.container}>
      <Logo />
      <View style={styles.containerText}>
        <ThemedText type="title" lightColor="#007BFF" darkColor="#4A90E2">
          ENTRE AGORA
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
          Preencha os campos abaixo para o login
        </ThemedText>
      </View>

      <View>
        <ThemedInput
          placeholder="Email"
          type="outlined"
          keyboardType="email-address"
        />
        <ThemedInput placeholder="Senha" type="outlined" isPassword />
        <ThemedText style={styles.esqueci}>
          <ThemedText
            type="link"
            style={styles.link}
            onPress={() => router.push("/(auth)/recuperacao")}
          >Esqueci minha senha</ThemedText>
        </ThemedText>
      </View>

      <ThemedButton
        title="Login Empresa"
        onPress={handlePress}
        isLoading={isLoading}
      />

      <ThemedText>
        Não tem conta?{" "}
        <ThemedText
          type="link"
          style={styles.link}
          onPress={() => router.push("/(authEmpresa)/cadastro")}
        >
          Registre-se agora
        </ThemedText>
      </ThemedText>

      <ThemedText>
        Cliente?{" "}
        <ThemedText
          type="link"
          style={styles.link}
          onPress={() => router.replace("/(auth)")}
        > Clique aqui</ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  containerText: {
    alignItems: "center",
    marginVertical: 40,
  },

  link: {
    color: "#007BFF",
  },

  esqueci: {
    textAlign: "right",
    textDecorationLine: "underline",
  },
});
