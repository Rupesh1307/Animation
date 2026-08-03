import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const MIN_SCALE = 0.9;
const MAX_SCALE = 1.2;

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ResponsiveReturn {
  width: number;
  height: number;

  safeWidth: number;
  safeHeight: number;

  insets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  safeTop: number;
  safeBottom: number;
  safeLeft: number;
  safeRight: number;

  isPhone: boolean;
  isTablet: boolean;
  isSmallDevice: boolean;

  isPortrait: boolean;
  isLandscape: boolean;

  breakpoint: Breakpoint;

  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;

  isMdUp: boolean;
  isLgUp: boolean;

  scale: number;

  spacing: (size: number) => number;
  font: (size: number) => number;

  moderateScale: (size: number, factor?: number) => number;

  horizontalScale: (size: number) => number;
  verticalScale: (size: number) => number;

  moderateHorizontalScale: (size: number, factor?: number) => number;

  moderateVerticalScale: (size: number, factor?: number) => number;

  wp: (percent: number) => number;
  hp: (percent: number) => number;

  defaultColumns: number;
  contentWidth: number;
  readableWidth: number;
}

export const useResponsive = (): ResponsiveReturn => {
  const { width, height } = useWindowDimensions();
  const safeAreaInsets = useSafeAreaInsets();

  return useMemo(() => {
    const { top, bottom, left, right } = safeAreaInsets;

    const shortestSide = Math.min(width, height);

    /**
     * Device classification
     */
    const isTablet = shortestSide >= 768;
    const isPhone = !isTablet;

    const isSmallDevice = shortestSide < 375;

    /**
     * Orientation
     */
    const isLandscape = width > height;
    const isPortrait = !isLandscape;

    /**
     * Breakpoints
     */
    let breakpoint: Breakpoint = 'xs';

    if (width >= 1280) {
      breakpoint = 'xl';
    } else if (width >= 1024) {
      breakpoint = 'lg';
    } else if (width >= 768) {
      breakpoint = 'md';
    } else if (width >= 480) {
      breakpoint = 'sm';
    }

    const isXs = breakpoint === 'xs';
    const isSm = breakpoint === 'sm';
    const isMd = breakpoint === 'md';
    const isLg = breakpoint === 'lg';
    const isXl = breakpoint === 'xl';

    const isMdUp = isMd || isLg || isXl;
    const isLgUp = isLg || isXl;

    /**
     * Safe dimensions
     */
    const safeWidth = width - left - right;
    const safeHeight = height - top - bottom;

    /**
     * Width scale (phones only)
     */
    const rawScale = width / BASE_WIDTH;

    const scale = isTablet
      ? 1
      : Math.min(Math.max(rawScale, MIN_SCALE), MAX_SCALE);

    /**
     * Basic helpers
     */
    const spacing = (size: number): number => Math.round(size * scale);

    const font = (size: number): number => Math.round(size * scale);

    const moderateScale = (size: number, factor = 0.5): number => {
      const scaled = size * scale;

      return Math.round(size + (scaled - size) * factor);
    };

    /**
     * Horizontal scaling
     */
    const horizontalScale = (size: number): number => {
      return Math.round(size * scale);
    };

    /**
     * Vertical scaling
     */
    const verticalScale = (size: number): number => {
      const verticalRatio = safeHeight / BASE_HEIGHT;

      return Math.round(size * verticalRatio);
    };

    /**
     * Moderate horizontal scaling
     */
    const moderateHorizontalScale = (size: number, factor = 0.5): number => {
      const scaled = horizontalScale(size);

      return Math.round(size + (scaled - size) * factor);
    };

    /**
     * Moderate vertical scaling
     */
    const moderateVerticalScale = (size: number, factor = 0.5): number => {
      const scaled = verticalScale(size);

      return Math.round(size + (scaled - size) * factor);
    };

    /**
     * Percentage helpers
     */
    const wp = (percent: number): number => {
      const p = Math.min(Math.max(percent, 0), 100);

      return Math.round((safeWidth * p) / 100);
    };

    const hp = (percent: number): number => {
      const p = Math.min(Math.max(percent, 0), 100);

      return Math.round((safeHeight * p) / 100);
    };

    /**
     * Grid
     */
    const defaultColumns = isXl ? 4 : isLg ? 3 : isMd ? 2 : 1;

    /**
     * Layout constraints
     */
    const contentWidth = isTablet ? Math.min(safeWidth * 0.9, 960) : safeWidth;

    const readableWidth = Math.min(contentWidth, 600);

    return {
      width,
      height,

      safeWidth,
      safeHeight,

      insets: {
        top,
        bottom,
        left,
        right,
      },

      safeTop: top,
      safeBottom: bottom,
      safeLeft: left,
      safeRight: right,

      isPhone,
      isTablet,
      isSmallDevice,

      isPortrait,
      isLandscape,

      breakpoint,

      isXs,
      isSm,
      isMd,
      isLg,
      isXl,

      isMdUp,
      isLgUp,

      scale,

      spacing,
      font,
      moderateScale,

      horizontalScale,
      verticalScale,

      moderateHorizontalScale,
      moderateVerticalScale,

      wp,
      hp,

      defaultColumns,

      contentWidth,
      readableWidth,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    width,
    height,
    safeAreaInsets.top,
    safeAreaInsets.bottom,
    safeAreaInsets.left,
    safeAreaInsets.right,
  ]);
};
