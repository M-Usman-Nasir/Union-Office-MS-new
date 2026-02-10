import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const MIN_TOP_INSET_ANDROID = 24;

/**
 * Wraps screen content with safe area. Uses insets with a minimum top on Android
 * so content never goes under the status bar when system insets are 0.
 */
export default function SafeScreen({ children, edges = ['top'], style }) {
  const insets = useSafeAreaInsets();
  const topInset =
    Platform.OS === 'android'
      ? Math.max(insets.top, MIN_TOP_INSET_ANDROID)
      : insets.top;

  return (
    <SafeAreaView
      edges={[]}
      style={[
        styles.safe,
        style,
        { paddingTop: topInset },
        edges.includes('bottom') && { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
