import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';

import { useStyles } from './styles';
import useGlobalStyles from '@theme/globleStyles';
import { useResponsive } from '@theme/matrix';

interface Banner {
  id: number;
  message: string;
}

const banners: Banner[] = [
  {
    id: 1,
    message: 'Free cancellation.',
  },
  {
    id: 2,
    message: 'No hidden fees.',
  },
  {
    id: 3,
    message: 'Verified guest reviews.',
  },
];

const AUTO_SCROLL_INTERVAL = 15000;

function VerticalBanner() {
  const { styles } = useStyles();
  const { styles: globalStyles } = useGlobalStyles();
  const { verticalScale } = useResponsive();

  const ITEM_HEIGHT = useMemo(() => verticalScale(60), [verticalScale]);

  const flatListRef = useRef<FlatList<Banner>>(null);

  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % banners.length;

      currentIndexRef.current = nextIndex;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const renderItem: ListRenderItem<Banner> = ({ item }) => {
    return (
      <View
        style={[
          styles.banner,
          {
            height: ITEM_HEIGHT,
          },
        ]}
      >
        <Text style={styles.bannerText}>{item.message}</Text>
      </View>
    );
  };

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
        <FlatList
          ref={flatListRef}
          data={banners}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onScrollToIndexFailed={({ index }) => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
              });
            }, 100);
          }}
        />
      </View>
    </View>
  );
}

export default React.memo(VerticalBanner);
