import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function AyahCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      {/* Verse key placeholder */}
      <View style={[styles.bar, { width: 60, height: 12, marginBottom: 20 }]} />
      {/* Arabic lines */}
      <View style={[styles.bar, { width: '100%', height: 14, marginBottom: 10 }]} />
      <View style={[styles.bar, { width: '85%', height: 14, marginBottom: 10, alignSelf: 'flex-end' }]} />
      <View style={[styles.bar, { width: '70%', height: 14, marginBottom: 20, alignSelf: 'flex-end' }]} />
      {/* Divider */}
      <View style={styles.divider} />
      {/* Translation lines */}
      <View style={[styles.bar, { width: '100%', height: 12, marginBottom: 8 }]} />
      <View style={[styles.bar, { width: '90%', height: 12, marginBottom: 8 }]} />
      <View style={[styles.bar, { width: '60%', height: 12 }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  bar: {
    backgroundColor: '#2A4A3A',
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#0D2A22',
    marginVertical: 14,
  },
});
