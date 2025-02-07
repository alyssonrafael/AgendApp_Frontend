import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedButton } from "@/src/components/ThemedButton";
import { router } from "expo-router";
import { ThemedSelect } from "@/src/components/ThemedSelect";
import { Logo } from "@/src/components/ThemedLogo";

export default function Recuperacao2Screen() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.dismissAll(); //volta diretamente para tela de loading
    }, 2000);
    setIsLoading(false);
    alert("Ação concluída!");
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Logo />
          <View style={styles.containerText}>
            <ThemedText type="title" lightColor="#007BFF" darkColor="#4A90E2">
              Recuperação de Senha
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={{ textAlign: "center", paddingHorizontal: 22 }}
            >
              Preencha os campos abaixo para recuperação da senha
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            <ThemedInput
              placeholder="Email"
              type="outlined"
              keyboardType="email-address"
            />
            <ThemedInput
              placeholder="Código de Recuperação"
              type="outlined"
              keyboardType="default"
            />
            <ThemedInput placeholder="Nova senha" type="outlined" isPassword />
            <ThemedInput
              placeholder="Confirme a nova senha"
              type="outlined"
              isPassword
            />

            <ThemedSelect
              selectedValue="usuario"
              onValueChange={(value) => alert(`Selecionado: ${value}`)}
              options={[
                { label: "Usuário", value: "usuario" },
                { label: "Empresa", value: "empresa" },
              ]}
            />
          </View>

          <ThemedButton
            title="Alterar senha"
            onPress={handlePress}
            isLoading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    paddingTop: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  formContainer: {
    alignItems: "center",
    width: "100%",
  },
  containerText: {
    alignItems: "center",
    marginVertical: 40,
  },
});
