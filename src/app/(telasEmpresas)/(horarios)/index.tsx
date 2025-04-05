import SessaoNavegarHorarios from '@/src/components/horariosComponenents/SessaoNavegarHorarios';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { ScrollView, StyleSheet } from 'react-native';

export default function horariosScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Parte Superior - ScrollView (2/3 da tela) */}
      <ScrollView style={styles.topSection}>
       <ThemedText>sessao dos horarios</ThemedText>
      </ScrollView>
      {/* Parte Inferior - Fixa (1/3 da tela) */}
      <ThemedView style={styles.bottomSection}>
      <SessaoNavegarHorarios/>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop:40
  },
  topSection: {
    flex: 2,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'flex-start',
    width:"100%",
    maxHeight:200,
    marginLeft:20
  },
});

