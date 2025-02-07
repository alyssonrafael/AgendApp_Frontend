import React, { useState } from 'react';
import { TextInput, type TextInputProps, StyleSheet, View, TouchableOpacity } from 'react-native';

import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'outlined' | 'underline';
  isPassword?: boolean;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  isPassword = false,
  ...rest
}: ThemedInputProps) {
  const [secureText, setSecureText] = useState(isPassword);

  const textColor = useThemeColor(
    { light: lightColor ?? '#49454F', dark: darkColor ?? '#FFF' },
    'text'
  );

  const borderColor = useThemeColor(
    { light: '#49454F', dark: '#A3A3A3' },
    'tint'
  );

  const backgroundColor = useThemeColor(
    { light: '#F7F7F7', dark: '#121212' },
    'background'
  );

  const containerStyle = [
    styles.container,
    type === 'outlined' ? { borderColor, borderWidth: 1 } : null,
  ];

  const inputStyle = [
    styles.inputBase,
    { color: textColor, backgroundColor },
    type === 'underline' ? styles.underline : null,
    style,
  ];

  return (
    <View style={containerStyle}>
      <TextInput
        style={inputStyle}
        placeholderTextColor={textColor}
        secureTextEntry={isPassword ? secureText : false}
        {...rest}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.icon}>
          <Ionicons name={secureText ? 'eye-off' : 'eye'} size={20} color={textColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 12,
    height:50,
    marginVertical:10
  },

  inputBase: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  underline: {
    borderBottomWidth: 2,
  },

  icon: {
    padding: 8,
  },
});
