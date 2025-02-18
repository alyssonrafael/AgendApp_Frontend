import { StyleSheet, Image, View } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";

export default function SessaoCafezinho() {
  return (
    <View style={styles.lastSection}>
      <Image
        source={require("../../assets//images/agendapp/QRrafael.jpg")}
        style={styles.image}
      />
      <ThemedText style={styles.description}>
        Ajude no cafezinho faça um doação de qualquer valor o App e grátis e sem
        anuncio essa doaçâo ajuda a manter o App!
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  lastSection: {
    alignItems: "center",
    marginTop: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});
