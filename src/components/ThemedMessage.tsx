import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/src/hooks/useThemeColor";

type MessageType = "success" | "danger" | "info" | "alert";

type ThemedMessageProps = {
  type: MessageType;
  message: string;
};

const iconMap: Record<MessageType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  danger: "close-circle",
  info: "information-circle",
  alert: "alert",
};

export function ThemedMessage({ type, message }: ThemedMessageProps) {
  const backgroundColor = useThemeColor(
    {
      light: type === "danger" ? "#f8d7da" : type === "success" ? "#d4edda" : type === "info" ? "#d1ecf1" : "#fff3cd",
      dark: type === "danger" ? "#721c24" : type === "success" ? "#155724" : type === "info" ? "#0c5460" : "#856404",
    },
    "background"
  );

  const textColor = useThemeColor(
    {
      light: "#000",
      dark: "#fff",
    },
    "text"
  );

  const opacity = new Animated.Value(0);

  useEffect(() => {
    // Animação de dissolver
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Após 5 segundos, a mensagem desaparece com animação
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <Animated.View style={[styles.container, { backgroundColor, opacity }]}>
      <Ionicons name={iconMap[type]} size={24} color={textColor} style={styles.icon} />
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginTop:40,
    marginRight:15,
    width:"80%",
    position: "absolute",  
    top: 0,                
    right: 0,              
    zIndex: 9999,          
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
});
