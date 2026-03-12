import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme';

const MIN_TOP_INSET_ANDROID = 24;

/**
 * Wraps screen content with safe area and consistent margins.
 * Uses insets with a minimum top on Android so content never goes under the status bar.
 * Applies left, right, top (below safe area), and bottom padding so content stays clear of edges.
 */
export default function SafeScreen({ children, edges = ['top'], style }) {
  const insets = useSafeAreaInsets();
  const topInset =
    Platform.OS === 'android'
      ? Math.max(insets.top, MIN_TOP_INSET_ANDROID)
      : insets.top;

  const bottomPadding = Math.max(insets.bottom, spacing.screenBottom);

  return (
    <SafeAreaView
      edges={[]}
      style={[
        styles.safe,
        style,
        {
          paddingTop: topInset + spacing.screenTop,
          paddingHorizontal: spacing.screenHorizontal,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
