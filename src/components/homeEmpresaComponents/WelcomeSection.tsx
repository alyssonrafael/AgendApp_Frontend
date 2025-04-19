import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Empresa } from "@/src/context/EmpresaContext";


// seçao de boas vindas da dashboard (home da empresa)
const WelcomeSection = ({
  empresa, //recebe as informaçoes da empresa
  backgroundCard, //recebe a cor de fundo
  secondaryTextCard, //recebe a cor secundaria do texto no card
}: {
  empresa: Empresa | null;
  backgroundCard: string;
  secondaryTextCard: string;
}) => (
  <ThemedView style={[styles.section, { backgroundColor: backgroundCard }]}>
    <ThemedText type="subtitle" style={{ flexWrap: "wrap" }}>
      Bem-vindo,{" "}
      <ThemedText type="subtitle" style={{ color: "#007BFF" }}>
        {empresa?.name}
      </ThemedText>
    </ThemedText>
    <ThemedText style={[styles.subtitle, { color: secondaryTextCard }]}>
      Aqui está seu resumo e ações rápidas.
    </ThemedText>
    <ThemedText style={{ fontSize: 10, color: secondaryTextCard }}>
      Para atualizar os dados role a tela para baixo
    </ThemedText>
  </ThemedView>
);

export default WelcomeSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
  },
});
