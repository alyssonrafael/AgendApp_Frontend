import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { useColorScheme } from "@/src/hooks/useColorSchemeCustom"; // Importando do hook personalizado

export function Logo({ style }: { style?: StyleProp<ImageStyle> }) {
  const colorScheme = useColorScheme(); // Obtém o tema correto do contexto

  const logoImage =
    colorScheme === "light"
      ? require("../assets/images/agendapp/login.png")
      : require("../assets/images/agendapp/logindark.png");

  return <Image source={logoImage} style={style} />;
}
