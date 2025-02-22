import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import React from 'react';
import {optionsType} from '../utills/types';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../utills/styles';

interface AppDropDownProps {
  data: optionsType[];
  onChange: (item: optionsType) => void;
  labelField: string;
  valueField: string;
  value: string;
  dropdownStyle?: StyleProp<TextStyle>;
  disable?: boolean;
}

const AppDropDown = ({
  data,
  labelField,
  onChange,
  valueField,
  dropdownStyle,
  value,
  disable,
}: AppDropDownProps) => {
  return (
    <Dropdown
      data={data}
      onChange={onChange}
      labelField={labelField}
      valueField={valueField}
      value={value}
      style={[dropdownStyle, styles.dropdownStyle]}
      disable={disable}
    />
  );
};

export default AppDropDown;

const styles = StyleSheet.create({
  dropdownStyle: {
    borderColor: colors.primaryMedium,
    color: 'black',
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 4,
  },
});
