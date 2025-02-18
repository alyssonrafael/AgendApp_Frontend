import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { Alert, BackHandler } from "react-native";
import { MessageProvider } from "../context/MessageContext";
import { ThemeProviderWrapper } from "../context/ThemeContext";

// Impede que a splash screen esconda antes do carregamento dos assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const segments = useSegments(); // Pega a rota atual

  // Função para remover o token do usuário
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      
    } catch (error) {
      console.error("Erro ao remover token:", error);
    }
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (segments.length === 1) {
        if (segments[0] === "(auth)" || segments[0] === "(authEmpresa)") {
          // Se o usuário estiver na tela de login ou login de empresa, sair do app
          Alert.alert("Sair do aplicativo", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => BackHandler.exitApp(),
            },
          ]);
          return true;
        } else {
          // Se estiver em qualquer outra tela principal, remover token e voltar para login
          Alert.alert(
            "Sair do aplicativo",
            "Deseja voltar para a tela de login?",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Sim",
                style: "destructive",
                onPress: async () => {
                  await removeToken(); // Remove o token antes de redirecionar
                  router.replace("/(auth)");
                },
              },
            ]
          );
          return true;
        }
      }
      return false; // Permite o comportamento normal de voltar
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [router, segments]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProviderWrapper>
      <MessageProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(telasUsers)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(telasEmpresas)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(authEmpresa)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </MessageProvider>
    </ThemeProviderWrapper>
  );
}
