import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedText } from "@/src/components/ThemedText";
import { IndisponibilidadesManager } from "../../../components/horariosComponenents/IndisponibilidadesMagager";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import ConfiguracaoHorarios from "@/src/components/horariosComponenents/ConfiguracaoHorarios";

export default function GerenciarGrade() {
  const [activeTab, setActiveTab] = useState("configuracoes"); // 'configuracoes' ou 'indisponibilidades'
  // Obtém cores personalizadas do tema (claro/escuro)
  const filterBackground = useThemeColor(
    { light: "#f0f0f0", dark: "#2a2a2a" },
    "background"
  );
  const activeFilterBackground = useThemeColor(
    { light: "#007AFF", dark: "#0a84ff" },
    "tint"
  );
  const activeFilterTextColor = useThemeColor(
    { light: "#fff", dark: "#fff" },
    "text"
  );
  return (
    <ThemedView style={styles.container}>
      {/* Abas de navegação */}
      <View
        style={[styles.tabContainer, { backgroundColor: filterBackground }]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "configuracoes" && {
              backgroundColor: activeFilterBackground,
            },
          ]}
          onPress={() => setActiveTab("configuracoes")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "configuracoes" && { color: activeFilterTextColor },
            ]}
          >
            Configurações
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "indisponibilidades" && {
              backgroundColor: activeFilterBackground,
            },
          ]}
          onPress={() => setActiveTab("indisponibilidades")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "indisponibilidades" && {
                color: activeFilterTextColor,
              },
            ]}
          >
            Indisponibilidades
          </ThemedText>
        </TouchableOpacity>
      </View>
      {/* se active bar for configuraçoes renderiza as configuraçoes se nao renderiza o componente de indisponibilidade */}
      {activeTab === "configuracoes" ? (
        <ConfiguracaoHorarios />
      ) : (
        <IndisponibilidadesManager />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    padding: 14,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
  },
});
