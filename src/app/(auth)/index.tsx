import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedInput } from "@/src/components/ThemedInput";
import { ThemedButton } from "@/src/components/ThemedButton";
import { GoogleButton } from "@/src/components/GoogleButton";
import { ThemedMessage } from "@/src/components/ThemedMessage";
import { router } from "expo-router";
import { Logo } from "@/src/components/ThemedLogo";

export default function LoginScreen() {

  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const [messageType, setMessageType] = useState<
    "success" | "danger" | "info" | "alert"
  >();
  const [menssageText, setMenssageText] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      if (isMounted) {
        setShowContent(true);
        translateY.value = withTiming(0, { duration: 800 });
        opacity.value = withTiming(1, { duration: 800 });
      }
    }, 1000);

    return () => {
      isMounted = false; // Evita a animação em um componente desmontado
    };
  }, []);

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setMessageType("info");
      setMenssageText("Ação concluída com sucesso!");
      // Incrementa o contador de mensagens para força renderização
      setMessageCount((prevCount) => prevCount + 1);
    }, 2000);
    router.replace("/(telasUsers)")

  };

  return (
    <ThemedView style={styles.container}>
      <Logo/>
      {!showContent ? (
        <View style={{ transform: [{ scale: 2 }] }}>
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={{ marginTop: 60 }}
          />
        </View>
      ) : (
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
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
            title="Login"
            onPress={handlePress}
            isLoading={isLoading}
          />

          <ThemedText>
            Não tem conta?{" "}
            <ThemedText
              type="link"
              style={styles.link}
              onPress={() => router.replace("/(auth)/cadastro")}
            >
              Registre-se agora
            </ThemedText>
          </ThemedText>

          <ThemedText>
            Empresa?{" "}
            <ThemedText
              type="link"
              style={styles.link}
              onPress={() => router.replace("/(authEmpresa)")}
            >
              Faça agora seu login
            </ThemedText>
          </ThemedText>

          <ThemedText style={{ marginTop: 6 }}>OU</ThemedText>

          <GoogleButton />
        </Animated.View>
      )}

      {/* Exibe a mensagem temporária */}
      {menssageText && messageCount > 0 ? (
        <ThemedMessage type={messageType!} message={menssageText} />
      ) : null}
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
