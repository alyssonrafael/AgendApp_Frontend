import { router, Tabs, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Alert, BackHandler, Platform } from "react-native";

import { HapticTab } from "@/src/components/HapticTab";
import TabBarBackground from "@/src/components/ui/TabBarBackground";
import { Colors } from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const segments = useSegments(); // Pega a rota atual

  useEffect(() => {
    const handleBackPress = () => {
      if (segments.length === 1 && segments[0] !== "(auth)") {
        // Se o usuário estiver na tab principal, mas não na tela de login
        Alert.alert("Sair do aplicativo", "Deseja voltar para a tela de login?", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sim",
            style: "destructive",
            onPress: () => router.replace("/(auth)"),
          },
        ]);
        return true; // Impede o comportamento padrão de fechar o app
      }
      return false; // Permite que o botão de voltar funcione normalmente
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [router, segments]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tabIconSelected,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Octicons size={28} name="graph" color={color} />,
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          title: "Serviços",
          tabBarIcon: ({ color }) => <AntDesign size={28} name="pluscircle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: "Reservas",
          tabBarIcon: ({ color }) => <Octicons size={28} name="briefcase" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(maisOpcoes)"
        options={{
          title: "Mais opções",
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="align-justify" color={color} />,
        }}
      />
    </Tabs>
  );
}
