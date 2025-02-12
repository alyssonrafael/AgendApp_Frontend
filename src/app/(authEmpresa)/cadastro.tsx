import { View, StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { router } from "expo-router";
import { Logo } from "@/src/components/ThemedLogo";
import CadastroEmpresaForm from "@/src/components/loginComponents/CadastroEmpresaForm";

export default function CadastroEmpresaScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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

        <CadastroEmpresaForm />
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
            onPress={() => router.replace("/(auth)/cadastro")}
          >
            Clique aqui
          </ThemedText>
        </ThemedText>
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
    marginVertical: 20,
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
