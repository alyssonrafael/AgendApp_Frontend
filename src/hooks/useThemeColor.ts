import { Colors } from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorSchemeCustom"; // Usa o novo hook

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light"; // Obtém o tema do contexto
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
