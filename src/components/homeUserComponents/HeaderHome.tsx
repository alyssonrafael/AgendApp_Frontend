import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useUser } from "@/src/context/UserContext";
import { ThemedText } from "../ThemedText";
import { Link } from "expo-router";

export default function HeaderHome() {
  // recupera as informaçoes do usuario do contexto 
  const { user } = useUser();

  return (
    // exibe o texto de boas vindas com o nome do usuario
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>Bem-vindo(a) </ThemedText>
        <ThemedText style={styles.title}>{user?.name}</ThemedText>
        <ThemedText style={styles.subtitle}>
          Aqui está um resumo dos seus agendamentos!
        </ThemedText>
      </View>
      {/* link pra o perfil do usuario usado dessa forma para acessar rota profunda */}
      <Link href={"/(telasUsers)/(maisOpcoes)/perfil"} asChild withAnchor>
        <TouchableOpacity>
          <View style={styles.profileIcon}>
            <ThemedText style={styles.profileInitial}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 20,
  },
  textContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    maxWidth: "80%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    flexWrap: "wrap",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
});
