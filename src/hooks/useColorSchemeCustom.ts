
import { useContext } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { ThemeContext } from "@/src/context/ThemeContext"; // ajuste o caminho conforme necessário

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme(); // Obtém o tema do sistema
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useColorScheme must be used within a ThemeProviderWrapper");
  }

  const { theme } = themeContext;

  if (theme === "system") {
    return systemColorScheme; // Usa o tema do sistema se estiver definido como "system"
  }

  return theme; // Usa o tema escolhido pelo usuário
}
