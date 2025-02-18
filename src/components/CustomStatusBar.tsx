// components/CustomStatusBar.tsx
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../context/ThemeContext";
import { useColorScheme } from "react-native";

export default function CustomStatusBar() {
  const { theme } = useTheme();
  const systemColorScheme = useColorScheme();

  // Define a cor da StatusBar com base no tema selecionado
  const barStyle =
    theme === "system"
      ? systemColorScheme === "dark"
        ? "light"
        : "dark"
      : theme === "dark"
      ? "light"
      : "dark";

  return <StatusBar style={barStyle} />;
}
