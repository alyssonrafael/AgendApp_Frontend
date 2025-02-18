import { StyleSheet, View } from "react-native";
import React from "react";
import { useTheme } from "@/src/context/ThemeContext";
import { ThemedOptionItem } from "../ThemedOptionItem";

export default function SessaoMudarTema() {
  const { theme, setTheme } = useTheme();

  return (
    <View style={styles.container2}>
      <View style={styles.optionContainer}>
        <ThemedOptionItem
          iconName="sunny-outline"
          text="Claro"
          onPress={() => setTheme("light")}
        />
        <View
          style={[
            styles.circleIndicator,
            theme === "light" ? styles.selectedCircle : null,
          ]}
        />
      </View>

      <View style={styles.optionContainer}>
        <ThemedOptionItem
          iconName="moon-outline"
          text="Escuro"
          onPress={() => setTheme("dark")}
        />
        <View
          style={[
            styles.circleIndicator,
            theme === "dark" ? styles.selectedCircle : null,
          ]}
        />
      </View>

      <View style={styles.optionContainer}>
        <ThemedOptionItem
          iconName="phone-portrait-outline"
          text="Sistema"
          onPress={() => setTheme("system")}
        />
        <View
          style={[
            styles.circleIndicator,
            theme === "system" ? styles.selectedCircle : null,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  circleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd", // Cor padrão da bolinha
    marginLeft: 10,
  },
  selectedCircle: {
    backgroundColor: "#4A90E2", // Cor da bolinha quando o tema está selecionado
  },
  container2: {
    paddingHorizontal: 10,
  },
});
