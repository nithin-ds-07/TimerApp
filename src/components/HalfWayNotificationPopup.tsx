import {FlatList, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {HalfWayNotificationNotificationDataType} from '../utills/types';
import {colors} from '../utills/styles';

type HalfWayNotificationPopupProps = {
  notificationData: HalfWayNotificationNotificationDataType[];
  open: boolean;
  onClose: () => void;
};

const HalfWayNotificationPopup = ({
  notificationData,
  open,
  onClose,
}: HalfWayNotificationPopupProps) => {
  const handleRenderItem = ({
    item,
  }: {
    item: HalfWayNotificationNotificationDataType;
  }) => {
    return (
      <View style={styles.notificationContainer}>
        <Text style={styles.taskDescriptionStyle}>{item.message}</Text>
        <Text style={styles.taskNameStyle}>{item.title}</Text>
      </View>
    );
  };
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onClose()}>
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContentContainer}>
          <Text style={styles.titleStyle}>Notification</Text>
          <FlatList data={notificationData} renderItem={handleRenderItem} />
        </View>
      </Pressable>
    </Modal>
  );
};

export default HalfWayNotificationPopup;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContentContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderStartStartRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 20,
    height: 300,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  notificationContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskNameStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.primary,
    textAlign: 'center',
  },
  taskDescriptionStyle: {
    fontSize: 16,
    color: colors.textKey,
    textAlign: 'center',
  },
});
