import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { router } from "expo-router";
import { GoogleButton } from "@/src/components/loginComponents/GoogleButton";
import { Logo } from "@/src/components/ThemedLogo";
import CadastroForm from "@/src/components/loginComponents/CadastroForm";

export default function CadastroScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Logo />
        <View style={styles.containerText}>
          <ThemedText type="title" lightColor="#007BFF" darkColor="#4A90E2">
            Cadastre-se agora
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
            Preencha os campos abaixo para o cadastro
          </ThemedText>
        </View>

        <CadastroForm />

        <ThemedText>
          Já tem conta?{" "}
          <ThemedText
            type="link"
            style={styles.link}
            onPress={() => router.replace("/(auth)")}
          >
            Login
          </ThemedText>
        </ThemedText>

        <ThemedText>
          Empresa?{" "}
          <ThemedText
            type="link"
            style={styles.link}
            onPress={() => router.replace("/(authEmpresa)")}
          >
            Clique aqui
          </ThemedText>
        </ThemedText>

        <ThemedText style={{ marginTop: 6 }}>OU</ThemedText>

        <GoogleButton />
      </ScrollView>
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
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
});
