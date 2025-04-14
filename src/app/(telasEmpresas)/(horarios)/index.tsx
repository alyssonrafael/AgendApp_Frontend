import SessaoNavegarHorarios from "@/src/components/horariosComponenents/SessaoNavegarHorarios";
import TabelaDeHorarios from "@/src/components/horariosComponenents/tabelaDeHorarios/TabelaDeHorarios";

import { ThemedView } from "@/src/components/ThemedView";
import { StyleSheet, View } from "react-native";

export default function horariosScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Parte Superior - ScrollView (2/3 da tela) */}
      <View style={styles.topSection}>
        {/* tabela com os horarios e os dias */}
        <TabelaDeHorarios/>
      </View>
      {/* Parte Inferior - Fixa (1/3 da tela) */}
      <View style={styles.bottomSection}>
        <SessaoNavegarHorarios />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingTop: 40,
  },
  topSection: {
    flex: 2,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    maxHeight: 170,
    marginHorizontal: 30,
  },
});
