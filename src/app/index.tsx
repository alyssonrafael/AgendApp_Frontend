import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/src/components/ThemedView';
import { router } from 'expo-router';
import { ThemedText } from '@/src/components/ThemedText';
import { useColorScheme } from '@/src/hooks/useColorScheme';

export default function IndexScreen() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();

  const logoImage =
    colorScheme === 'light'
      ? require('../assets/images/agendapp/logoagenda.png')
      : require('../assets/images/agendapp/logoagendadark.png');

  useEffect(() => {
    const checkFirstTime = async () => {
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
      if (hasSeenWelcome) {
        router.replace('/(auth)'); // Se já viu, pula direto para a tela de login/cadastro
      } else {
        setIsFirstTime(true);
      }
    };

    checkFirstTime();
  }, []);

  const handlePress = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true'); // Salva no armazenamento local
    router.replace('/(auth)');
  };

  if (isFirstTime === null) return null; // Evita piscar a tela enquanto carrega

  return (
    <ThemedView style={styles.container}>
      <Image source={logoImage} />
      <ThemedText type="title">Seja bem-vindo</ThemedText>
      <ThemedText type="default" style={styles.subtitle}>
        Faça agora mesmo seu cadastro e comece a utilizar o app.
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Comece agora</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  subtitle: {
    textAlign: 'center',
  },
  button: {
    width: 285,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
