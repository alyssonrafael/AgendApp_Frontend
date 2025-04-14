import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";
import { useThemeColor } from "@/src/hooks/useThemeColor";

// Interface que define as propriedades do componente
interface IndisponibilidadeItemProps {
  id: string; // Identificador único da indisponibilidade
  horario: string; // Horário da indisponibilidade
  motivo: string; // Razão da indisponibilidade
  data?: string | null; // Data específica (opcional) para indisponibilidade pontual
  copyToClipboard: (text: string, type: string) => Promise<void>; // Função para copiar texto
}

// Componente que exibe um item de indisponibilidade
const IndisponibilidadeItem: React.FC<IndisponibilidadeItemProps> = ({
  id,
  horario,
  motivo,
  data,
  copyToClipboard,
}) => {
  // Define a cor de fundo baseada no tema (claro/escuro)
  const backgroundUnavibleMessageColor = useThemeColor(
    { light: "#ffecb3", dark: "#c17900" },
    "background"
  );

  return (
    <ThemedView
      style={[
        styles.indisponibilidadeItem,
        { backgroundColor: backgroundUnavibleMessageColor }, // Aplica a cor de fundo
      ]}
    >
      {/* Linha com o ID e botão de copiar */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ThemedText style={styles.infoText}>
          <ThemedText>Id: </ThemedText>
          {id.slice(0, 8)}...{id.slice(-4)}
        </ThemedText>
        <TouchableOpacity
          onPress={() => copyToClipboard(id, "Id da Indisponibilidade")}
          style={styles.copyButton}
        >
          <MaterialIcons name="content-copy" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.infoText}>
        <ThemedText>Horário: </ThemedText>
        {horario}
      </ThemedText>

      {motivo !== "Unavailable time" && (
        <ThemedText style={styles.infoText}>
          <ThemedText>Motivo: </ThemedText>
          {motivo}
        </ThemedText>
      )}

      {data ? (
        <ThemedText style={styles.infoText}>
          <ThemedText>Tipo:</ThemedText>
          Indisponibilidade Pontual
        </ThemedText>
      ) : (
        <ThemedText style={styles.infoText}>
          <ThemedText>Tipo: </ThemedText>
          Indisponibilidade global
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  indisponibilidadeItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    maxWidth: "90%",
  },
  copyButton: {
    marginLeft: "auto",
    paddingLeft: 10,
    padding: 4,
  },
});

export default IndisponibilidadeItem;
