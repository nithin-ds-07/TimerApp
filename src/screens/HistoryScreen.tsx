import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COMPLETEDTIMERS} from '../utills/constants';
import {AddTimerType} from '../utills/types';
import UpArrowIcon from '../utills/assets/images/upArrow.svg';
import DownArrowIcon from '../utills/assets/images/downArrow.svg';
import {colors} from '../utills/styles';
import {DashBoardNavigationProps} from '../navigation/NavigationType';
import {useNavigation} from '@react-navigation/native';

const HistoryScreen = () => {
  const [completedTimers, setCompletedTimers] = useState<AddTimerType[]>([]);
  const [openAccordianIndex, setOpenAccordianIndex] = useState<number>(0);
  const [isAccordianOpen, setIsAccordianOpen] = useState<boolean>(true);
  const navigation = useNavigation<DashBoardNavigationProps>();
  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        const value = await AsyncStorage.getItem(COMPLETEDTIMERS);
        const data = value ? JSON.parse(value) : [];

        setCompletedTimers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
        setCompletedTimers([]);
      }
    };
    fetchLocalData();
  }, []);
  const handleRenderItem = (item: AddTimerType, index: number) => {
    return (
      <View style={styles.renderList}>
        <View style={styles.renderListHeader}>
          <Text style={styles.renderListHeaderName}>{item.name}</Text>
          <View style={styles.statusArrowContainer}>
            <Text
              style={[styles.renderListHeaderName, {color: colors.completed}]}>
              {item.status === 'completed' ? 'Completed' : '-'}
            </Text>
            {isAccordianOpen && openAccordianIndex === index ? (
              <View style={styles.arrowContainer}>
                <UpArrowIcon
                  onPress={() => {
                    setIsAccordianOpen(false);
                    setOpenAccordianIndex(-1);
                  }}
                />
              </View>
            ) : (
              <View style={styles.arrowContainer}>
                <DownArrowIcon
                  onPress={() => {
                    setOpenAccordianIndex(index);
                    setIsAccordianOpen(true);
                  }}
                />
              </View>
            )}
          </View>
        </View>
        {isAccordianOpen && openAccordianIndex === index && (
          <>
            <View style={[styles.renderListHeader, {marginVertical: 4}]}>
              <Text style={styles.renderDetailsKeyStyle}>Category</Text>
              <Text style={styles.renderDetailsValueStyle}>
                {item.category}
              </Text>
              <Text style={styles.renderDetailsKeyStyle}>
                Half Way Notification
              </Text>
              <Text style={styles.renderDetailsValueStyle}>
                {item.halfWayNotification ? 'true' : 'false'}
              </Text>
            </View>
            <View style={styles.renderListHeader}>
              <Text style={styles.renderDetailsKeyStyle}>Duration</Text>
              <Text style={styles.renderDetailsValueStyle}>
                {item.duration}
              </Text>
              <Text style={styles.renderDetailsKeyStyle}>
                Remaining Duration
              </Text>
              <Text style={styles.renderDetailsValueStyle}>
                {item.remainingDuration}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleStyle}>History Dashboard</Text>
        <Text style={styles.headerSubTitleStyle}>Log of completed timers</Text>
      </View>
      {completedTimers.length === 0 && (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListStyle}>No timers found</Text>
          <TouchableOpacity
            onPress={async () => {
              navigation.goBack();
            }}>
            <Text style={styles.clearHistoryStyle}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
      {completedTimers.length > 0 && (
        <TouchableOpacity
          onPress={async () => {
            navigation.goBack();
          }}
          style={styles.clearHistoryContainer}>
          <Text style={styles.clearHistoryStyle}>Go Back</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={completedTimers}
        renderItem={({item, index}) => handleRenderItem(item, index)}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListStyle: {
    fontWeight: '700',
    fontSize: 20,
    color: colors.textKey,
  },
  clearHistoryContainer: {
    width: '100%',
    paddingRight: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  clearHistoryStyle: {
    fontWeight: '700',
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 4,
    padding: 4,
    color: colors.red,
    marginTop: 10,
    marginLeft: 10,
  },
  renderListContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  renderList: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 4,
    borderColor: colors.primaryMedium,
    backgroundColor: colors.primaryLight,
  },
  arrowContainer: {padding: 6},
  renderListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  renderListHeaderName: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.black,
  },
  statusArrowContainer: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  renderDetailsKeyStyle: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.textKey,
  },
  renderDetailsValueStyle: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.black,
  },
});
