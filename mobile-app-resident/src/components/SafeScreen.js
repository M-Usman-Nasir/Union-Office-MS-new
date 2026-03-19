import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme';

const MIN_TOP_INSET_ANDROID = 24;

/**
 * Wraps screen content with safe area and consistent margins.
 * Uses insets with a minimum top on Android so content never goes under the status bar.
 * Applies left, right, top (below safe area), and bottom padding so content stays clear of edges.
 *
 * @param {boolean} [noTopPadding=false] — If true, skips top padding so a screen can draw edge-to-edge
 *   under the status bar (e.g. Dashboard navy header applies its own `paddingTop` from insets).
 *
 * Horizontal insets: device safe area (notch / curved edges) plus `spacing.screenHorizontal` on every screen.
 */
export default function SafeScreen({ children, edges = ['top'], style, noTopPadding = false }) {
  const insets = useSafeAreaInsets();
  const topInset =
    Platform.OS === 'android'
      ? Math.max(insets.top, MIN_TOP_INSET_ANDROID)
      : insets.top;

  const bottomPadding = Math.max(insets.bottom, spacing.screenBottom);

  const paddingTop = noTopPadding ? 0 : topInset + spacing.screenTop;
  const paddingLeft = insets.left + spacing.screenHorizontal;
  const paddingRight = insets.right + spacing.screenHorizontal;

  return (
    <SafeAreaView
      edges={[]}
      style={[
        styles.safe,
        style,
        {
          paddingTop,
          paddingLeft,
          paddingRight,
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
