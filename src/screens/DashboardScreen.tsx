import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COMPLETEDTIMERS, LOCALTIMERS} from '../utills/constants';
import {
  AddTimerType,
  HalfWayNotificationNotificationDataType,
  TimerActionsType,
} from '../utills/types';
import AppButton from '../components/AppButton';
import {useNavigation} from '@react-navigation/native';
import {DashBoardNavigationProps} from '../navigation/NavigationType';
import {colors} from '../utills/styles';

import UpArrowIcon from '../utills/assets/images/upArrow.svg';
import DownArrowIcon from '../utills/assets/images/downArrow.svg';
import PlayIcon from '../utills/assets/images/play.svg';
import PauseIcon from '../utills/assets/images/pause.svg';
import ResetIcon from '../utills/assets/images/reset.svg';
import CustomProgressBar from '../components/CustomProgressBar';
import HalfWayNotificationPopup from '../components/HalfWayNotificationPopup';
import AppDropDown from '../components/AppDropDown';
import {timerCategory} from '../utills/dropdownData';

const DashboardScreen = () => {
  const [timers, setTimers] = useState<AddTimerType[]>([]);
  const [actions, setActions] = useState<TimerActionsType>({
    start: false,
    pause: false,
    reset: false,
    startAll: false,
    pauseAll: false,
    resetAll: false,
  });
  const [openAccordianIndex, setOpenAccordianIndex] = useState<number>(0);
  const [isAccordianOpen, setIsAccordianOpen] = useState<boolean>(true);
  const [openHalfWayNotification, setOpenHalfWayNotification] =
    useState<boolean>(false);
  const [notificationData, setNotificationData] = useState<
    HalfWayNotificationNotificationDataType[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'all',
  );
  const navigation = useNavigation<DashBoardNavigationProps>();
  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        const value = await AsyncStorage.getItem(LOCALTIMERS);
        const data = value ? JSON.parse(value) : [];

        setTimers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
        setTimers([]);
      }
    };
    fetchLocalData();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (actions.start) {
      intervalId = setInterval(() => {
        setTimers(prev =>
          prev.map((timer, index) =>
            index === openAccordianIndex &&
            (timer.category === selectedCategory || selectedCategory === 'all')
              ? {
                  ...timer,
                  remainingDuration: Math.max(
                    (timer.remainingDuration ?? 0) - 1,
                    0,
                  ),
                  successNotification:
                    (timer.remainingDuration ?? 0) - 1 <= 0 ? true : false,
                  status:
                    (timer.remainingDuration ?? 0) === 0
                      ? 'completed'
                      : 'inProgress',
                }
              : timer,
          ),
        );
      }, 1000);
    }

    if (actions.pause && intervalId) {
      setActions(prev => ({
        ...prev,
        start: false,
        pause: false,
        startAll: false,
        pauseAll: false,
      }));
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [actions.start, actions.pause, openAccordianIndex, selectedCategory]);

  useEffect(() => {
    let intervalBulkId: NodeJS.Timeout | null = null;

    if (actions.startAll) {
      intervalBulkId = setInterval(() => {
        setTimers(prev =>
          prev.map(timer =>
            timer.category === selectedCategory || selectedCategory === 'all'
              ? {
                  ...timer,
                  remainingDuration: Math.max(
                    (timer.remainingDuration ?? 0) - 1,
                    0,
                  ),
                  successNotification:
                    (timer.remainingDuration ?? 0) - 1 <= 0 ? true : false,
                  status:
                    (timer.remainingDuration ?? 0) - 1 <= 0
                      ? 'completed'
                      : 'inProgress',
                }
              : timer,
          ),
        );
      }, 1000);
    }

    if (actions.pauseAll && intervalBulkId) {
      setActions(prev => ({
        ...prev,
        start: false,
        pause: false,
        startAll: false,
        pauseAll: false,
      }));
      clearInterval(intervalBulkId);
    }

    return () => {
      if (intervalBulkId) {
        clearInterval(intervalBulkId);
      }
    };
  }, [actions.startAll, actions.pauseAll, selectedCategory]);

  useEffect(() => {
    setOpenHalfWayNotification(false);
    AsyncStorage.setItem(LOCALTIMERS, JSON.stringify(timers)).catch(error =>
      console.error('Error saving timers:', error),
    );
    const completedTimers = timers.filter(
      timer => timer.status === 'completed',
    );
    completedTimers.forEach(timer => (timer.successNotification = false));
    AsyncStorage.setItem(
      COMPLETEDTIMERS,
      JSON.stringify(completedTimers),
    ).catch(error => console.error('Error saving completed timers:', error));
    if (actions.start || actions.startAll) {
      const halfwayTimers = timers.filter(
        timer =>
          timer.halfWayNotification &&
          timer.remainingDuration === Math.floor((timer.duration ?? 0) / 2),
      );

      if (halfwayTimers.length > 0) {
        setOpenHalfWayNotification(true);
        setNotificationData(
          halfwayTimers.map(timer => ({
            title: `${timer.name}`,
            message: 'Congratulations! You have completed 50% of your task.',
          })),
        );
      }
      const completedTimer = timers.filter(
        timer => timer.successNotification && timer.remainingDuration === 0,
      );

      if (completedTimer.length > 0) {
        setOpenHalfWayNotification(true);
        setNotificationData(
          completedTimer.map(timer => ({
            title: `${timer.name}`,
            message: 'Congratulations! You have completed your task.',
          })),
        );
      }
    }
  }, [timers, actions]);

  useEffect(() => {
    setActions(prev => ({
      ...prev,
      start: false,
      pause: false,
      startAll: false,
      pauseAll: false,
    }));
  }, [openAccordianIndex]);

  const handleRenderItem = (item: AddTimerType, index: number) => {
    if (
      selectedCategory &&
      item.category !== selectedCategory &&
      selectedCategory !== 'all'
    ) {
      return null;
    } else if (
      selectedCategory === 'all' ||
      selectedCategory === item.category
    ) {
      return (
        <View style={styles.renderList}>
          <View style={styles.renderListHeader}>
            <View
              style={[
                styles.footerContainer,
                {
                  width: '18%',
                },
              ]}>
              <Text style={styles.renderListHeaderName}>{item.name}</Text>
              {openAccordianIndex !== index && (
                <View style={styles.progressBarContainer}>
                  <Text>
                    {Math.round(
                      (1 -
                        (timers[index].remainingDuration ?? 0) /
                          (timers[index].duration ?? 0)) *
                        100,
                    ) || 0}
                    %
                  </Text>

                  <CustomProgressBar
                    duration={timers[index].duration ?? 0}
                    remainingDuration={timers[index].remainingDuration ?? 0}
                  />
                </View>
              )}
            </View>
            <View style={styles.statusArrowContainer}>
              <Text
                style={[
                  styles.renderListHeaderName,
                  {
                    color:
                      item.status === 'inProgress'
                        ? colors.inProgress
                        : item.status === 'completed'
                        ? colors.completed
                        : colors.pending,
                  },
                ]}>
                {item.status === 'inProgress'
                  ? 'In Progress'
                  : item.status === 'completed'
                  ? 'Completed'
                  : 'Pending'}
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
            <View style={styles.cardBodyStyle}>
              <View style={[styles.renderListHeader, {marginTop: 10}]}>
                <Text style={styles.renderDetailsKeyStyle}>Category</Text>
                <Text style={styles.renderDetailsValueStyle}>
                  {item.category}
                </Text>
                <Text style={styles.renderDetailsKeyStyle}>
                  Half Way Notification
                </Text>
                <Text style={styles.renderDetailsValueStyle}>
                  {item.halfWayNotification ? 'Enable' : 'Disable'}
                </Text>
              </View>
              <View style={[styles.renderListHeader, {marginTop: 10}]}>
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
              <View style={styles.footerContainer}>
                <View style={[styles.progressBarContainer, {width: '40%'}]}>
                  <Text>
                    {Math.round(
                      (1 -
                        (timers[index].remainingDuration ?? 0) /
                          (timers[index].duration ?? 0)) *
                        100,
                    ) || 0}
                    %
                  </Text>

                  <CustomProgressBar
                    duration={timers[index].duration ?? 0}
                    remainingDuration={timers[index].remainingDuration ?? 0}
                  />
                </View>
                <View style={styles.actionContainer}>
                  <TouchableOpacity
                    style={styles.actionIconContainer}
                    onPress={() => {
                      handlePause();
                    }}>
                    <PauseIcon height={16} width={16} />
                    <Text style={styles.actonTitleStyle}>Pause</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconContainer}
                    onPress={() => {
                      handleStart();
                    }}>
                    <PlayIcon height={16} width={16} />
                    <Text style={styles.actonTitleStyle}>Start</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconContainer}
                    onPress={() => {
                      handleReset();
                    }}>
                    <ResetIcon height={16} width={16} />
                    <Text style={styles.actonTitleStyle}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      );
    } else return null;
  };

  const handleStart = () => {
    setActions({
      ...actions,
      start: true,
    });
  };
  const handlePause = () => {
    setActions({
      ...actions,
      pause: true,
    });
  };
  const handleReset = () => {
    setActions(prev => ({
      ...prev,
      start: false,
      pause: false,
      pauseAll: false,
      startAll: false,
    }));
    setTimers(prev =>
      prev.map(
        (timer, idx) =>
          idx === openAccordianIndex
            ? {
                ...timer,
                remainingDuration: timer.duration,
                status: 'pending',
                successNotification: false,
              }
            : timer, // Keep other timers unchanged
      ),
    );
  };
  const onClose = () => {
    setNotificationData([]);
    setOpenHalfWayNotification(false);
  };

  const handleStartAll = () => {
    setActions(prev => ({...prev, startAll: true}));
  };

  const handlePauseAll = () => {
    setActions(prev => ({...prev, pauseAll: true}));
  };

  const handleResetAll = async () => {
    setTimers(prev =>
      prev.map(timer => ({
        ...timer,
        remainingDuration: timer.duration,
        status: 'pending',
        successNotification: false,
      })),
    );
    setActions(prev => ({
      ...prev,
      startAll: false,
      pauseAll: false,
      start: false,
      pause: false,
    }));
    await AsyncStorage.removeItem(COMPLETEDTIMERS);
  };

  const handleClearAll = async () => {
    setTimers([]);
    setActions({
      start: false,
      pause: false,
      reset: false,
      startAll: false,
      pauseAll: false,
      resetAll: false,
    });
    await AsyncStorage.clear();
    setNotificationData([]);
  };
  return (
    <View style={styles.container}>
      <HalfWayNotificationPopup
        open={openHalfWayNotification}
        notificationData={notificationData}
        onClose={onClose}
      />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleStyle}>Timer Dashboard</Text>
        <Text style={styles.headerSubTitleStyle}>Welcome to Timer App</Text>
      </View>
      <View style={styles.buttonContainer}>
        <AppDropDown
          data={[...timerCategory, {label: 'All', value: 'all'}]}
          onChange={value => {
            setSelectedCategory(value.value);
            setActions({
              start: false,
              pause: false,
              reset: false,
              startAll: false,
              pauseAll: false,
              resetAll: false,
            });
          }}
          labelField="label"
          valueField="value"
          value={selectedCategory ?? ''}
          dropdownStyle={styles.dropdownStyle}
        />
        <AppButton
          title="Add Timer"
          onClick={() => {
            navigation.navigate('AddTimerScreen');
          }}
          buttonStyle={styles.buttonStyle}
        />
        <AppButton
          title="History"
          onClick={() => {
            navigation.navigate('HistoryScreen');
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
      <View style={styles.bulkActionButtonContainer}>
        <Text style={styles.bulkActionTitleStyle}>Bulk Action:</Text>
        <TouchableOpacity
          onPress={() => {
            handlePauseAll();
          }}>
          <Text
            style={[
              styles.bulkActionButtonTitleStyle,
              {color: colors.inProgress},
            ]}>
            Pause All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStartAll()}>
          <Text
            style={[
              styles.bulkActionButtonTitleStyle,
              {color: colors.completed},
            ]}>
            Start All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleResetAll()}>
          <Text
            style={[styles.bulkActionButtonTitleStyle, {color: colors.red}]}>
            Reset All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClearAll()}>
          <Text
            style={[styles.bulkActionButtonTitleStyle, {color: colors.red}]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.renderListContainer}>
        <FlatList
          data={timers}
          renderItem={({item, index}) => handleRenderItem(item, index)}
        />
      </View>
    </View>
  );
};

export default DashboardScreen;

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
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dropdownStyle: {
    flex: 0.8,
    backgroundColor: colors.primaryLight,
    color: colors.black,
  },
  buttonStyle: {flex: 0.5, marginLeft: 10},
  renderListContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  bulkActionButtonContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  bulkActionTitleStyle: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.textKey,
  },
  bulkActionButtonTitleStyle: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  renderList: {
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
    borderRadius: 4,
    borderColor: colors.primaryMedium,
    backgroundColor: colors.primaryLight,
  },
  arrowContainer: {padding: 6},
  cardBodyStyle: {
    marginTop: 8,
    borderTopColor: colors.primaryMedium,
    borderTopWidth: 1,
  },
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
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E9EDF2',
    borderRadius: 5,
    marginTop: '3%',
    width: '36%',
    alignSelf: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#112A39',
    borderRadius: 5,
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
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    justifyContent: 'flex-end',
  },
  actionIconContainer: {
    alignItems: 'center',
  },
  actonTitleStyle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
});
