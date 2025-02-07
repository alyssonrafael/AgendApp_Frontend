import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedButton } from "@/src/components/ThemedButton";
import { router } from "expo-router";
import { Logo } from "@/src/components/ThemedLogo";

export default function CadastroEmpresaScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Ação concluída!");
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <Logo />
      <View style={styles.containerText}>
        <ThemedText
          type="title"
          lightColor="#007BFF"
          darkColor="#4A90E2"
          style={{ textAlign: "center" }}
        >
          Cadastre-se agora e cressa conosco
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
          Preencha os campos abaixo para o cadastro
        </ThemedText>
      </View>

      <View>
        <ThemedInput placeholder="Nome" type="outlined" />
        <ThemedInput placeholder="Nome do seu negocio" type="outlined" />
        <ThemedInput
          placeholder="Email"
          type="outlined"
          keyboardType="email-address"
        />
        <ThemedInput placeholder="Senha" type="outlined" isPassword />
      </View>

      <ThemedButton
        title="Alterar senha"
        onPress={handlePress}
        isLoading={isLoading}
      />

      <ThemedText>
        Ja tem conta?{" "}
        <ThemedText
          type="link"
          style={styles.link}
          onPress={() => router.push("/(authEmpresa)")}
        >
          Login
        </ThemedText>
      </ThemedText>
      <ThemedText>
        Cadastre-se como Usuario{" "}
        <ThemedText
          type="link"
          style={styles.link}
          onPress={() => router.replace("/(auth)")}
        >
          Clique aqui
        </ThemedText>
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
