import { Linking, View } from "react-native";
import React from "react";
import { ThemedOptionItem } from "../ThemedOptionItem";
import { router } from "expo-router";

export default function SessaoSobreEmpresa() {
  const mandarEmail = () => {
    Linking.openURL(
      "mailto:alyssonrafaelf@outlook.com?subject=Suporte&body=Descreva qual foi o problema encontrado na aplicação. Estamos aqui para ajudar e retornaremos esse email o mais rapido possivel."
    );
  };
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <ThemedOptionItem
        iconName="help-circle-outline"
        text="Suporte"
        onPress={() => {
          mandarEmail();
        }}
      />
      <ThemedOptionItem
        iconName="information-circle-outline"
        text="Sobre"
        onPress={() => {
          router.push("/(telasEmpresas)/(maisOpcoes)/sobre");
        }}
      />
    </View>
  );
}
