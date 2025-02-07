import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/useColorScheme";
import { Alert, BackHandler } from "react-native";

// Impede que a splash screen esconda antes do carregamento dos assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const segments = useSegments(); // Pega a rota atual

  useEffect(() => {
    const handleBackPress = () => {
      if (segments.length === 1) {
        if (segments[0] !== "(auth)") {
          // Se o usuário estiver na tab principal, mas não na tela de login
          Alert.alert("Sair do aplicativo", "Deseja voltar para a tela de login?", [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sim",
              style: "destructive",
              onPress: () => router.replace("/(auth)"),
            },
          ]);
          return true; // Impede o comportamento padrão
        } else {
          // Se o usuário estiver na tela de login, sair do app
          Alert.alert("Sair do aplicativo", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => BackHandler.exitApp(),
            },
          ]);
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(telasUsers)" options={{ headerShown: false }} />
        <Stack.Screen name="(telasEmpresas)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(authEmpresa)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
