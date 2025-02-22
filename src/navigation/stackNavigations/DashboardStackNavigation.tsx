import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DashboardScreen from '../../screens/DashboardScreen';
import AddTimerScreen from '../../screens/AddTimerScreen';
import HistoryScreen from '../../screens/HistoryScreen';

export type DashboardStackScreensType = {
  DashBoardScreen: undefined;
  AddTimerScreen: undefined;
  HistoryScreen: undefined;
};

const DashboardStackNavigation = () => {
  const DashboardStack =
    createNativeStackNavigator<DashboardStackScreensType>();
  return (
    <DashboardStack.Navigator screenOptions={{headerShown: false}}>
      <DashboardStack.Screen
        name="DashBoardScreen"
        component={DashboardScreen}
      />
      <DashboardStack.Screen name="AddTimerScreen" component={AddTimerScreen} />
      <DashboardStack.Screen name="HistoryScreen" component={HistoryScreen} />
    </DashboardStack.Navigator>
  );
};

export default DashboardStackNavigation;
