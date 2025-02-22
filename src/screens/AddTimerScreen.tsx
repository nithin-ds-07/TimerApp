import {StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';
import AppTextInput from '../components/AppTextInput';
import AppDropDown from '../components/AppDropDown';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AppButton from '../components/AppButton';
import {timerCategory} from '../utills/dropdownData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AddTimerType} from '../utills/types';
import {useNavigation} from '@react-navigation/native';
import {DashBoardNavigationProps} from '../navigation/NavigationType';
import {LOCALTIMERS} from '../utills/constants';
import {colors} from '../utills/styles';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Timer name is required'),
  duration: Yup.number()
    .required('Duration is required')
    .min(1, 'Duration must be at least 1 second')
    .typeError('Duration must be a number'),
  category: Yup.string().required('Category is required'),
  halfWayNotification: Yup.bool(),
});

const AddTimerScreen = () => {
  const [createTimeData] = useState<AddTimerType>({
    name: '',
    duration: null,
    category: '',
    remainingDuration: 0,
    status: 'pending',
    halfWayNotification: false,
    successNotification: false,
  });

  const navigation = useNavigation<DashBoardNavigationProps>();
  return (
    <Formik
      initialValues={createTimeData}
      validationSchema={validationSchema}
      onSubmit={async values => {
        try {
          values.remainingDuration =
            (values.duration ?? 0) - (values.remainingDuration ?? 0);
          const jsonValue = await AsyncStorage.getItem(LOCALTIMERS);
          let timers = jsonValue ? JSON.parse(jsonValue) : [];

          if (!Array.isArray(timers)) {
            console.error('Stored data is not an array, resetting...');
            timers = [];
          }

          timers.push(values);

          await AsyncStorage.setItem(LOCALTIMERS, JSON.stringify(timers));

          console.log('New timer added successfully:', values);
          setTimeout(() => {
            navigation.navigate('DashBoardScreen');
          }, 1000);
        } catch (error) {
          console.error('Error adding to array:', error);
        }
      }}>
      {({values, setFieldValue, handleSubmit, errors, touched}) => {
        return (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitleStyle}>Add Timer</Text>
              <Text style={styles.headerSubTitleStyle}>
                Add a new timer to the list
              </Text>
            </View>
            <View style={styles.formContainer}>
              <AppTextInput
                placeholder="Enter the timer name"
                onChangeValue={value => {
                  setFieldValue('name', value);
                }}
                value={values.name}
                maxLength={12}
              />
              {errors.name && touched.name && (
                <View>
                  <Text style={styles.errorText}>{errors.name}</Text>
                </View>
              )}
              <AppTextInput
                placeholder="Enter the duration(Seconds)"
                onChangeValue={value => {
                  setFieldValue('duration', Number(value));
                }}
                value={values.duration ? String(values.duration) : ''}
                keyboardType="numeric"
              />
              {errors.duration && touched.duration && (
                <View>
                  <Text style={styles.errorText}>{errors.duration}</Text>
                </View>
              )}
              <AppDropDown
                data={timerCategory}
                labelField="label"
                valueField="value"
                onChange={item => {
                  setFieldValue('category', item.value);
                }}
                value={values.category}
              />
              {errors.category && touched.category && (
                <View>
                  <Text style={styles.errorText}>{errors.category}</Text>
                </View>
              )}
              <View style={styles.halfWayNotificationContainer}>
                <Text>Half Way Notification</Text>
                <Switch
                  value={values.halfWayNotification}
                  onValueChange={() => {
                    setFieldValue(
                      'halfWayNotification',
                      !values.halfWayNotification,
                    );
                  }}
                />
              </View>

              <AppButton
                title={'Create Timer'}
                onClick={() => {
                  handleSubmit();
                }}
              />
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

export default AddTimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    height: '16%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 20,
    color: colors.black,
  },
  headerSubTitleStyle: {
    fontWeight: '400',
    fontSize: 16,
    color: colors.textKey,
  },
  formContainer: {
    rowGap: 16,
    marginTop: 20,
    width: '90%',
  },
  halfWayNotificationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorText: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '400',
  },
});
