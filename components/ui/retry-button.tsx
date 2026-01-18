import { Pressable, StyleSheet, Text } from 'react-native';

import { AppFonts } from '@/constants/theme';

type RetryButtonProps = {
  isFetching?: boolean;
  onPress: () => void;
};

export function RetryButton({ isFetching = false, onPress }: RetryButtonProps) {
  return (
    <Pressable
      style={[styles.button, isFetching ? styles.buttonDisabled : null]}
      onPress={onPress}
      disabled={isFetching}
    >
      <Text style={styles.text}>{isFetching ? 'Trying again...' : 'Try again'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#5631E8',
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: AppFonts.rubikMedium,
  },
});
