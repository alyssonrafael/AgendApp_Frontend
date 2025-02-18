import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { Logo } from "@/src/components/ThemedLogo";
import Recuperacao2Form from "@/src/components/loginComponents/recuperacao2Form";

export default function Recuperacao2Screen() {
  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
              Preencha os campos abaixo para redefinir sua senha.
            </ThemedText>
          </View>

          <Recuperacao2Form />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    padding: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  containerText: {
    alignItems: "center",
    marginVertical: 40,
  },
});
