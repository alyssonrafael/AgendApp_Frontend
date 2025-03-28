import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function ThemedButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  style,
  textStyle,
}: ThemedButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
    >
{isLoading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              {icon}
            </View>
          )}
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>
              {icon}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%' ,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});
