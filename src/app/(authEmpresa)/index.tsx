import {  StyleSheet, View } from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { router } from "expo-router";
import { LoginEmpresaForm } from "@/src/components/loginComponents/LoginEmpresaForm";
import { Logo } from "@/src/components/ThemedLogo";

export default function LoginEmpresaScreen() {
  
  return (
    <ThemedView style={styles.container}>
      <Logo />
      <View>
      <LoginEmpresaForm/>
      </View>
      <View style={styles.maisOpcoes}>
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
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    color: "#007BFF",
  },
  maisOpcoes: {
    alignItems: "center",
  },
});
