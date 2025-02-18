import { StyleSheet,View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { GoogleButton } from "@/src/components/loginComponents/GoogleButton";
import { router } from "expo-router";
import { Logo } from "@/src/components/ThemedLogo";
import { LoginForm } from "@/src/components/loginComponents/LoginForm";

export default function LoginScreen() {
  const [showContent, setShowContent] = useState(false);

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
    }, 2000);

    return () => {
      isMounted = false; // Evita a animação em um componente desmontado
    };
  }, []);

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <ThemedView style={styles.container}>
      <Logo />
      {!showContent ? (
        <View style={{ transform: [{ scale: 2 }] }}>
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={{ marginTop: 60 }}
          />
          <ThemedText style={styles.textInicio}>Preparando o seu App...</ThemedText>
        </View>
      ) : (
        <Animated.View style={formAnimatedStyle}>
          <LoginForm />
          <View style={styles.maisOpcoes}>
            <ThemedText>
              Não tem conta?{" "}
              <ThemedText
                type="link"
                style={styles.link}
                onPress={() => router.push("/(auth)/cadastro")}
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
                Clique aqui
              </ThemedText>
            </ThemedText>

            <ThemedText style={{ marginVertical: 6 }}>OU</ThemedText>

            <GoogleButton />
          </View>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  textInicio:{
    fontSize:10
  },
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
