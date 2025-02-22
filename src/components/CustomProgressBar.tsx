import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {colors} from '../utills/styles';

interface ProgressBarProps {
  duration: number;
  remainingDuration: number;
  height?: number;
  backgroundColor?: string;
  barColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

const CustomProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  remainingDuration,
  height = 10,
  backgroundColor = colors.white,
  barColor = colors.primary,
  borderColor = colors.primaryMedium,
  borderWidth = 0.4,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const progress = duration > 0 ? 1 - remainingDuration / duration : 0;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  return (
    <View
      style={[
        styles.container,
        {height, backgroundColor, borderWidth, borderColor},
      ]}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
});

export default CustomProgressBar;
