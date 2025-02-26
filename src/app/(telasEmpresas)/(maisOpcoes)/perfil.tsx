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
import { useEmpresa } from "@/src/context/EmpresaContext";
import { apiImages } from "@/src/services/api";

export default function Perfil() {
  // pegando informaçoes da empresa no contexto
  const { empresa, loading } = useEmpresa();

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

  // se loading exibe a tela indicando o carregamento
  if (loading) {
    return (
      <ThemedView style={styles.containerloading}>
        <ActivityIndicator size="large" color="#007BFF" />
        <ThemedText>Carregando perfil da empresa...</ThemedText>
      </ThemedView>
    );
  }
  //se nao tiver empresa exibe a tela indicando o erro
  if (!empresa) {
    return (
      <ThemedView style={styles.containerloading}>
        <ThemedText style={styles.errorText}>
          Erro ao carregar o perfil. Tente novamente mais tarde.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] },
          ]}
        >
          {/* se a empresa tiver uma foto definida exibe ela se nao o circulo com o a inicial do nome */}
          <View style={styles.imageview}>
            {empresa.image ? (
              <View style={styles.imageContainer}>
                <Animated.Image
                  source={{
                    uri: `${apiImages}${empresa.image}`,
                  }}
                  style={[styles.image, { opacity: fadeAnim }]}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={styles.circle}>
                <Text style={styles.initial}>
                  {empresa.nomeEmpresa.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <ThemedText style={styles.imageviewtext}>
              {empresa.nomeEmpresa}
            </ThemedText>
          </View>

          <View style={styles.infoContainer}>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Email:
              </ThemedText>
              <ThemedText>{empresa.email}</ThemedText>
            </View>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Descrição da empresa
              </ThemedText>
              <ScrollView
                style={styles.descriptionContainer}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <ThemedText>
                {empresa?.description || "Descrição ainda não atualizada."}
                </ThemedText>
              </ScrollView>
            </View>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Criado em:
              </ThemedText>
              <ThemedText>
                {new Date(empresa.createdAt).toLocaleDateString("pt-BR")}
              </ThemedText>
            </View>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Criado por:
              </ThemedText>
              <ThemedText>{empresa.name}</ThemedText>
            </View>
            <View>
              <ThemedText type="subtitle" style={styles.label}>
                Tipo de conta
              </ThemedText>
              <ThemedText>Empresa</ThemedText>
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
    color: "red",
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  descriptionContainer: {
    maxHeight: 150,
    paddingHorizontal: 5,
  },
});
