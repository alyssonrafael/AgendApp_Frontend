import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { router } from "expo-router";
import { ThemedButton } from "@/src/components/ThemedButton";
import { GoogleButton } from "@/src/components/GoogleButton";
import { Logo } from "@/src/components/ThemedLogo";


export default function CadastroScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);

    setTimeout(() => {
      router.replace("/(auth)")
      setIsLoading(false);
    }, 2000);
    alert("Ação concluída!");

  };


  return (
    <ThemedView style={styles.container}>
      <Logo/>
      <View style={styles.containerText}>
        <ThemedText type="title" lightColor="#007BFF" darkColor="#4A90E2">
          Cadastre-se agora
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
          Preencha os campos abaixo para o cadastro
        </ThemedText>
      </View>

      <View>
        <ThemedInput placeholder="Nome" type="outlined" />
        <ThemedInput
          placeholder="Email"
          type="outlined"
          keyboardType="email-address"
        />
        <ThemedInput placeholder="Senha" type="outlined" isPassword />
      </View>

      <ThemedButton
        title="Cadastre-se"
        onPress={handlePress}
        isLoading={isLoading}
      />

      <ThemedText>
        Ja tem conta?{" "}
        <ThemedText
          type="link"
          style={styles.link}
          onPress={() => router.replace("/(auth)")}
        >
          Login
        </ThemedText>
      </ThemedText>

      <ThemedText>
        Cadastre-se como negocio{" "}
        <ThemedText
          type="link"
          style={styles.link}
          onPress={() => router.replace("/(authEmpresa)/cadastro")}
        >
          Clique aqui
        </ThemedText>
      </ThemedText>

      <ThemedText style={{ marginTop: 6 }}>OU</ThemedText>

      <GoogleButton />
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
