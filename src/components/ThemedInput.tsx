import React, { useState } from "react";
import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { useThemeColor } from "@/src/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "outlined" | "underline" | "big";
  isPassword?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right';
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  type = "default",
  isPassword = false,
  errorMessage = "",
  icon,
  iconPosition = "left",
  ...rest
}: ThemedInputProps) {
  const [secureText, setSecureText] = useState(isPassword);

  const textColor = useThemeColor(
    { light: lightColor ?? "#49454F", dark: darkColor ?? "#FFF" },
    "text"
  );

  const borderColor = useThemeColor(
    { light: "#49454F", dark: "#A3A3A3" },
    "tint"
  );

  const backgroundColor = useThemeColor(
    { light: "#F7F7F7", dark: "#121212" },
    "background"
  );

  const containerStyle = [
    styles.container,
    type === "outlined" ? { borderColor, borderWidth: 1 } : null,
    type === "big" ? [styles.big, { borderColor, borderWidth: 1 }] : null,
  ];

  const inputStyle = [
    styles.inputBase,
    { color: textColor, backgroundColor },
    type === "underline" ? styles.underline : null,
    style,
  ];

  return (
<>
      <View style={containerStyle}>
        {icon && iconPosition === 'left' && (
          <View style={[styles.iconContainer, styles.iconLeft]}>
            {icon}
          </View>
        )}
        
        <TextInput
          style={[
            inputStyle,
            icon && iconPosition === 'left' ? styles.inputWithLeftIcon : null,
            icon && iconPosition === 'right' ? styles.inputWithRightIcon : null,
          ]}
          placeholderTextColor={textColor}
          secureTextEntry={isPassword ? secureText : false}
          {...rest}
        />
        
        {icon && iconPosition === 'right' && !isPassword && (
          <View style={[styles.iconContainer, styles.iconRight]}>
            {icon}
          </View>
        )}
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={[styles.iconContainer, styles.iconRight]}
          >
            <Ionicons
              name={secureText ? "eye-off" : "eye"}
              size={20}
              color={textColor}
            />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginVertical: 10,
  },

  inputBase: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  iconContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputWithLeftIcon: {
    paddingLeft: 8, 
  },
  inputWithRightIcon: {
    paddingRight: 8, 
  },

  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },

  underline: {
    borderBottomWidth: 2,
  },

  big: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: "auto",
    maxHeight: 200,
  },

  icon: {
    padding: 8,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
