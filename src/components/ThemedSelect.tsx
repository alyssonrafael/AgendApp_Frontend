import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/src/hooks/useThemeColor';

export type ThemedSelectProps = {
  options: { label: string; value: string }[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSelect({ options, selectedValue, onValueChange, lightColor, darkColor }: ThemedSelectProps) {
  const [selected, setSelected] = useState(selectedValue || options[0]?.value);
  const [isOpen, setIsOpen] = useState(false);

  const textColor = useThemeColor({ light: lightColor ?? '#49454F', dark: darkColor ?? '#FFF' }, 'text');
  const backgroundColor = useThemeColor({ light: '#F7F7F7', dark: '#121212' }, 'background');
  const borderColor = useThemeColor({ light: '#49454F', dark: '#A3A3A3' }, 'tint');

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>      
      <TouchableOpacity style={styles.select} onPress={() => setIsOpen(!isOpen)}>
        <Text style={[styles.text, { color: textColor }]}> 
          Tipo de Conta: {options.find((opt) => opt.value === selected)?.label}
        </Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={textColor} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => {
                setSelected(option.value);
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              <Text style={[styles.text, { color: textColor }]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    borderWidth: 1,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width:"100%"
  },
  optionsContainer: {
    marginTop: 5,
    borderRadius: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 16,
  },
});
