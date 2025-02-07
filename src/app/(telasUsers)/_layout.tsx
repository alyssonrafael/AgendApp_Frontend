import { useEffect } from "react";
import { Tabs, router, useSegments } from "expo-router";
import { Platform, BackHandler, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { HapticTab } from "@/src/components/HapticTab";
import TabBarBackground from "@/src/components/ui/TabBarBackground";
import { useThemeColor } from "@/src/hooks/useThemeColor"; // Importando o hook

export default function TabLayout() {
  const segments = useSegments(); // Pega a rota atual
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const tabIconSelected = useThemeColor({}, "tabIconSelected");

  useEffect(() => {
    const handleBackPress = () => {
      if (segments.length === 1 && segments[0] !== "(auth)") {
        Alert.alert(
          "Sair do aplicativo",
          "Deseja voltar para a tela de login?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sim",
              style: "destructive",
              onPress: () => router.replace("/(auth)"),
            },
          ]
        );
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [router, segments]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabIconSelected,
        tabBarInactiveTintColor: tabIconDefault, // Cor do ícone inativo
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              size={28}
              name="home"
              color={focused ? tabIconSelected : tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: "Reservas",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              size={28}
              name="calendar-alt"
              color={focused ? tabIconSelected : tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="agendamento"
        options={{
          title: "Agendamentos",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              size={28}
              name="clock"
              color={focused ? tabIconSelected : tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(maisOpcoes)"
        options={{
          title: "Mais opções",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              size={28}
              name="align-justify"
              color={focused ? tabIconSelected : tabIconDefault}
            />
          ),
        }}
      />
    </Tabs>
  );
}
