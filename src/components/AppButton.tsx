import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../utills/styles';

interface AppButtonProps {
  title: string;
  onClick: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTitleStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export default function AppButton({
  onClick,
  title,
  buttonStyle,
  buttonTitleStyle,
  disabled,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.buttonStyle,
        buttonStyle,
        {backgroundColor: disabled ? '#ccc' : colors.primary},
      ]}
      disabled={disabled}>
      <Text style={[styles.buttonTitleStyle, buttonTitleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    width: '100%',
    padding: 10,
  },
  buttonTitleStyle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
