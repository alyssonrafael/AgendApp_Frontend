import { View, StyleSheet, Text } from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { router } from "expo-router";
import { Logo } from "@/src/components/ThemedLogo";
import RecuperacaoForm from "@/src/components/loginComponents/recuperacaoForm";

export default function RecuperacaoScreen() {
  return (
    <ThemedView style={styles.container}>
      <Logo />
      <View style={styles.containerText}>
        <ThemedText type="title" lightColor="#007BFF" darkColor="#4A90E2">
          Esqueci minha Senha
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
          Preencha o campo abaixo com o seu email
        </ThemedText>
      </View>

      <RecuperacaoForm />

      <View style={styles.linkView}>
        <ThemedText
          type="link"
          style={styles.link}
          onPress={() => router.push("/(auth)/recuperacao2")}
        >
          Já tenho um código, recuperar agora
        </ThemedText>
        <Text onPress={() => router.back()} style={styles.link}>
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
