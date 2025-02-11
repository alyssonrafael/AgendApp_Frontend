import React, { createContext, useState, useContext, ReactNode } from "react";
import { ThemedMessage } from "@/src/components/ThemedMessage";
import { View, StyleSheet } from "react-native";

type MessageType = "success" | "danger" | "info" | "alert";

interface MessageContextData {
  showMessage: (type: MessageType, text: string) => void;
}

const MessageContext = createContext<MessageContextData | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType | null>(null);

  const showMessage = (type: MessageType, text: string) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {message && messageType && (
        <View style={styles.messageContainer}>
          <ThemedMessage type={messageType} message={message} />
        </View>
      )}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextData => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage deve ser usado dentro de um MessageProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  messageContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
});
