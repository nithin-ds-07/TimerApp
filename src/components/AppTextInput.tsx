import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
} from 'react-native';
import React from 'react';
import {colors} from '../utills/styles';

interface AppTextInputType {
  placeholder: string;
  textInputStyle?: StyleProp<TextStyle>;
  value: string;
  onChangeValue: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  autoCorrect?: boolean;
  editable?: boolean;
  maxLength?: number;
}

const AppTextInput = ({
  onChangeValue,
  placeholder,
  textInputStyle,
  value,
  autoCapitalize,
  autoCorrect,
  editable,
  secureTextEntry,
  multiline,
  numberOfLines,
  keyboardType,
  maxLength,
}: AppTextInputType) => {
  return (
    <TextInput
      value={value}
      style={[textInputStyle, styles.textInput]}
      onChangeText={onChangeValue}
      placeholder={placeholder}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      editable={editable}
      maxLength={maxLength}
      placeholderTextColor={colors.textKey}
    />
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  textInput: {
    borderColor: colors.primaryMedium,
    borderWidth: 1,
    padding: 12,
    width: '100%',
    borderRadius: 4,
  },
});
