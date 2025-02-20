import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/src/components/HapticTab";
import TabBarBackground from "@/src/components/ui/TabBarBackground";
import { Colors } from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import Octicons from "@expo/vector-icons/Octicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomStatusBar from "../../components/CustomStatusBar";
import { EmpresaProvider } from "@/src/context/EmpresaContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <>
    <EmpresaProvider>
      <CustomStatusBar />
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
      </EmpresaProvider>
    </>
  );
}
