import { StyleSheet, View, ScrollView } from "react-native";
import { ThemedText } from "@/src/components/ThemedText";
import { ThemedView } from "@/src/components/ThemedView";
import SessaoMudarTema from "@/src/components/maisOpcoesComponents/sessaoMudarTema";
import SessaoCafezinho from "@/src/components/maisOpcoesComponents/SessaoCafezinho";
import SessaoEmpresa from "@/src/components/maisOpcoesComponents/SessaoEmpresa";
import SessaoSobreEmpresa from "@/src/components/maisOpcoesComponents/SessaoSobreEmpresa";

export default function MaisOpcoesEmpresaScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Primeira View */}
        <View style={styles.section}>
          <ThemedText style={styles.title}>Perfil</ThemedText>
          <View style={styles.separator} />
          <SessaoEmpresa />
        </View>

        {/* segunda view */}
        <View style={styles.section}>
          <ThemedText style={styles.title}>Tema</ThemedText>
          <View style={styles.separator} />
          <SessaoMudarTema />
        </View>

        {/* Terceira View */}
        <View style={styles.section}>
          <ThemedText style={styles.title}>Mais sobre o App</ThemedText>
          <View style={styles.separator} />
          <SessaoSobreEmpresa />
        </View>

        {/* Última View (Imagem + Texto) */}
        <SessaoCafezinho />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
