import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({
  width = '100%',
  height = 12,
  borderRadius = 6,
  style,
}: SkeletonProps) {
  return <View style={[styles.base, { width, height, borderRadius }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E6E7F2',
  },
});
