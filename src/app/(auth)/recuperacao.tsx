import { View, StyleSheet,Text } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { router } from "expo-router";
import { ThemedButton } from "@/src/components/ThemedButton";
import { Logo } from "@/src/components/ThemedLogo";


export default function RecuperacaoScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Ação concluída!");
      router.push('/(auth)/recuperacao2')
    }, 2000);
  };


  return (
    <ThemedView style={styles.container}>
      <Logo/>
      <View style={styles.containerText}>
        <ThemedText type="title" lightColor="#007BFF" darkColor="#4A90E2">
          Esqueci minha Senha
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
          Preencha o campo abaixo com o seu email
        </ThemedText>
      </View>

      <View>
        <ThemedInput
          placeholder="Email"
          type="outlined"
          keyboardType="email-address"
        />
      </View>

      <ThemedButton
        title="Enviar"
        onPress={handlePress}
        isLoading={isLoading}
      />
      <View style={styles.linkView}>
      <ThemedText type="link" style={styles.link} onPress={handlePress}>
          Ja tenho um código, recuperar agora
        </ThemedText>
        <Text onPress={() => router.back() } style={styles.link}>
    Voltar para login
  </Text>
      </View>
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
    marginTop: 6,
  },

  linkView: {
    alignItems: "flex-end",
    width: "90%",
  },
});
