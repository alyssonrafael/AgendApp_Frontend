import { StyleSheet, Image, ScrollView, Text } from "react-native";
import React from "react";
import { ThemedText } from "@/src/components/ThemedText";
import { useColorScheme } from "@/src/hooks/useColorSchemeCustom";
import { ThemedView } from "@/src/components/ThemedView";

export default function sobre() {
  const colorScheme = useColorScheme();

  const logoImage =
    colorScheme === "light"
      ? require("../../../assets/images/agendapp/logoagenda.png")
      : require("../../../assets/images/agendapp/logoagendadark.png");
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={logoImage} style={styles.image} />
        <ThemedText type="subtitle" style={{ marginBottom: 20 }}>
          Sobre o Agenda App
        </ThemedText>
        <ThemedText>
          O <Text style={styles.A}>A</Text>genda <Text style={styles.A}>A</Text>
          pp foi criado para facilitar a conexão entre empresas e clientes,
          tornando o agendamento de serviços mais simples e organizado. Com uma
          interface intuitiva, o aplicativo permite que clientes marquem
          compromissos de forma rápida e prática, enquanto empresas gerenciam
          seus horários de maneira eficiente. Nosso objetivo é oferecer uma
          experiência ágil e sem complicações, garantindo mais comodidade para
          os clientes e mais produtividade para os negócios. Baixe agora e tenha
          seu tempo sempre bem planejado!
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  image: {
    width: 300,
    height: 275,
  },
  A: {
    color: "#4A90E2",
  },
});
