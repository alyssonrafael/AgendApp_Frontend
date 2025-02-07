import React, { useState } from 'react';
import { 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  Image, 
  View 
} from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { router } from 'expo-router';

export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#FFF' }, 'text');

  const handlePress = async () => {
    setIsLoading(true); // Inicia o carregamento

    // Simula uma requisição assíncrona (ex: API call)
    setTimeout(() => {
      setIsLoading(false); // Finaliza o carregamento após 2 segundos
      router.replace('/(telasUsers)')
    }, 2000);
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={handlePress}
      disabled={isLoading} // Desativa o botão enquanto está carregando
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          <Image source={require('../assets/images/Googleimg.png')} style={styles.logo} />
          <Text style={[styles.buttonText, { color: textColor }]}>Login com Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
