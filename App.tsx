import {StyleSheet, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DashboardStackNavigation from './src/navigation/stackNavigations/DashboardStackNavigation';

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <DashboardStackNavigation />
      </NavigationContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
