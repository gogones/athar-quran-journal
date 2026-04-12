import React, { useState, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '📖',
    title: 'One Verse, Every Day',
    body: 'Each morning, Athar brings you a single verse from the Quran — one to sit with, not scroll past.',
  },
  {
    icon: '✍️',
    title: 'Write What It Means to You',
    body: 'Reflect in your own words. No right answers. Just your honest thoughts on what the verse stirs in you.',
  },
  {
    icon: '🔥',
    title: 'Build a Lasting Habit',
    body: 'Your streak grows with every day you reflect. Keep the connection alive beyond Ramadan, one verse at a time.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  async function handleDone() {
    await AsyncStorage.setItem('athar:onboarded', 'true');
    router.replace('/');
  }

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  }

  function handleNext() {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      handleDone();
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {activeIndex === SLIDES.length - 1 ? "Let's Begin" : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1F1A' },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: { fontSize: 72, marginBottom: 32 },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  body: {
    color: '#8AABA3',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A2E28',
  },
  dotActive: {
    backgroundColor: '#1DB954',
    width: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  skipText: { color: '#4A6B63', fontSize: 15, fontWeight: '600' },
  nextBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
  },
  nextBtnText: { color: '#0D1F1A', fontSize: 16, fontWeight: '700' },
});
