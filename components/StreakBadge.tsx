import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  streak: number;
}

export default function StreakBadge({ streak }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2E28',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  fire: { fontSize: 18 },
  count: { fontSize: 18, fontWeight: '700', color: '#F5C842' },
  label: { fontSize: 13, color: '#8AABA3' },
});
