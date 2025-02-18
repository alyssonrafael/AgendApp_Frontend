import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/src/hooks/useThemeColor";

export type ThemedOptionItemProps = {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
  onPress: () => void;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedOptionItem({
  iconName,
  text,
  onPress,
  lightColor,
  darkColor,
}: ThemedOptionItemProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={color} />
      <ThemedText style={[styles.text, { color }]}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    marginLeft: 12,
  },
});
