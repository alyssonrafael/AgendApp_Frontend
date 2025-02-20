import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useRef, useEffect } from "react";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedButton } from "@/src/components/ThemedButton";
import { router } from "expo-router";
import { useUser } from "@/src/context/UserContext";

export default function Perfil() {
  //pegando informaçoes do usuario do contexto
  const { user, loading } = useUser();

  // Ref para animação
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

//se loading exibe o indicativo
  if (loading) {
    return (
      <ThemedView style={styles.containerloading}>
        <ActivityIndicator size="large" color="#007BFF" />
        <ThemedText>Carregando seu perfil...</ThemedText>
      </ThemedView>
    );
  }
// se nao consguir o user exibe essa tela indicando o erro 
  if (!user) {
    return (
      <ThemedView style={styles.containerloading}>
        <ThemedText style={styles.errorText}>
          Erro ao carregar o perfil. Tente novamente.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] },
          ]}
        >
          <View style={styles.imageview}>
            <View style={styles.circle}>
              <Text style={styles.initial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <ThemedText style={styles.imageviewtext}>{user.name}</ThemedText>
          </View>

          <View style={styles.infoContainer}>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Email:
              </ThemedText>
              <ThemedText>{user.email}</ThemedText>
            </View>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Criado em:
              </ThemedText>
              <ThemedText>
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </ThemedText>
            </View>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Total de agendamentos
              </ThemedText>
              <ThemedText>Rota a ser implementada</ThemedText>
            </View>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Tipo de conta
              </ThemedText>
              <ThemedText>Usuário</ThemedText>
            </View>
          </View>

          <View style={styles.buttonview}>
            <ThemedButton
              title="Atualizar Perfil"
              onPress={() => router.push("/editarPerfil")}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  containerloading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "flex-start",
    padding: 20,
  },
  animatedContainer: {
    width: "100%",
  },
  imageview: {
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  imageviewtext: {
    fontSize: 32,
    paddingTop: 20,
    textAlign: "center",
    lineHeight: 40,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  initial: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  infoContainer: {
    width: "100%",
    gap: 30,
  },
  label: {
    fontWeight: "600",
    marginBottom: 10,
  },
  buttonview: {
    width: "100%",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
});
