import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useResponsive } from '@theme/matrix';
import useGlobalStyles from '@theme/globleStyles';
import { useStyles } from './styles';

interface Banner {
  id: number;
  message: string;
}

const BANNERS: Banner[] = [
  { id: 1, message: 'Free cancellation.' },
  { id: 2, message: 'No hidden fees.' },
  { id: 3, message: 'Verified guest reviews.' },
  { id: 4, message: '24/7 customer support.' },
];

const AUTO_SCROLL_INTERVAL = 15000;
const ANIMATION_DURATION = 400;

function VerticalBanner() {
  const { styles } = useStyles();
  const { styles: globalStyles } = useGlobalStyles();
  const { verticalScale } = useResponsive();

  const ITEM_HEIGHT = verticalScale(60);

  const currentIndexRef = useRef(0);

  const translateY = useSharedValue(0);

  //const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (BANNERS.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % BANNERS.length;

      translateY.value = withTiming(-currentIndexRef.current * ITEM_HEIGHT, {
        duration: ANIMATION_DURATION,
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [ITEM_HEIGHT]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <View style={globalStyles.container}>
      <View
        style={[
          styles.container,
          {
            height: ITEM_HEIGHT,
            overflow: 'hidden',
          },
        ]}
      >
        <Animated.View style={animatedStyle}>
          {BANNERS.map(item => (
            <View
              key={item.id}
              style={[
                styles.banner,
                {
                  height: ITEM_HEIGHT,
                },
              ]}
            >
              <Text style={styles.bannerText}>{item.message}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

export default VerticalBanner;
