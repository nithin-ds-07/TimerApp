import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DashboardStackScreensType} from './stackNavigations/DashboardStackNavigation';

export type DashBoardNavigationProps = NativeStackNavigationProp<
  DashboardStackScreensType,
  'DashBoardScreen'
>;
