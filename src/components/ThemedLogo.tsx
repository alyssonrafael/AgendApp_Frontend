import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import { useColorScheme } from "@/src/hooks/useColorScheme";

export function Logo({ style }: { style?: StyleProp<ImageStyle> }) {
  const colorScheme = useColorScheme();
  const logoImage =
    colorScheme === "light"
      ? require("../assets/images/agendapp/login.png")
      : require("../assets/images/agendapp/logindark.png");

  return <Image source={logoImage} style={style} />;
}
