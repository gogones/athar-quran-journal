import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJournal } from '../hooks/useJournal';

function FlashCard({
  arabic,
  verseKey,
  translation,
  reflection,
}: {
  arabic: string;
  verseKey: string;
  translation: string;
  reflection: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate  = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = anim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity  = anim.interpolate({ inputRange: [0, 0.5, 0.5, 1], outputRange: [0, 0, 1, 1] });

  function flip() {
    Animated.spring(anim, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  }

  return (
    <TouchableOpacity onPress={flip} activeOpacity={1} style={styles.cardWrapper}>
      {/* Front — Arabic + verse key */}
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          { transform: [{ rotateY: frontRotate }], opacity: frontOpacity },
        ]}
      >
        <Text style={styles.verseKeyBadge}>{verseKey}</Text>
        <Text style={styles.arabicText}>{arabic}</Text>
        <Text style={styles.flipHint}>Tap to reveal your reflection</Text>
      </Animated.View>

      {/* Back — translation + reflection */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          { transform: [{ rotateY: backRotate }], opacity: backOpacity },
        ]}
      >
        <Text style={styles.verseKeyBadge}>{verseKey}</Text>
        <Text style={styles.translationText}>{translation}</Text>
        <View style={styles.divider} />
        <Text style={styles.reflectionLabel}>Your reflection</Text>
        <Text style={styles.reflectionText}>{reflection}</Text>
        <Text style={styles.flipHint}>Tap to flip back</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ReviewScreen() {
  const { entries, loading } = useJournal();
  const [index, setIndex] = useState(0);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (entries.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Review</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🃏</Text>
          <Text style={styles.emptyText}>No cards yet.</Text>
          <Text style={styles.emptySubtext}>Save a reflection from Today's tab{'\n'}and it will appear here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const entry = entries[index];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Review</Text>
        <Text style={styles.counter}>{index + 1} / {entries.length}</Text>
      </View>

      <View style={styles.cardArea}>
        <FlashCard
          key={entry.id}
          arabic={entry.verseText}
          verseKey={entry.verseKey}
          translation={entry.translation}
          reflection={entry.reflection}
        />
      </View>

      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
          onPress={() => setIndex(i => i - 1)}
          disabled={index === 0}
        >
          <Text style={[styles.navBtnText, index === 0 && styles.navBtnTextDisabled]}>← Prev</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          {entries.slice(0, Math.min(entries.length, 7)).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index % 7 && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navBtn, index === entries.length - 1 && styles.navBtnDisabled]}
          onPress={() => setIndex(i => i + 1)}
          disabled={index === entries.length - 1}
        >
          <Text style={[styles.navBtnText, index === entries.length - 1 && styles.navBtnTextDisabled]}>Next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1F1A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '700' },
  counter: { color: '#4A6B63', fontSize: 14, fontWeight: '600' },

  cardArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    height: 420,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 28,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
  },
  cardFront: {
    backgroundColor: '#1A2E28',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: '#0F2920',
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  verseKeyBadge: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 24,
    textAlign: 'center',
  },
  arabicText: {
    fontFamily: 'Amiri_400Regular',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 56,
    flex: 1,
    textAlignVertical: 'center',
  },
  flipHint: {
    color: '#4A6B63',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  translationText: {
    color: '#8AABA3',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  divider: { height: 1, backgroundColor: '#1A3D30', marginVertical: 16 },
  reflectionLabel: {
    color: '#1DB954',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  reflectionText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  navBtn: {
    backgroundColor: '#1A2E28',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  navBtnTextDisabled: { color: '#4A6B63' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1A2E28' },
  dotActive: { backgroundColor: '#1DB954' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyText: { color: '#8AABA3', fontSize: 16, fontWeight: '600' },
  emptySubtext: { color: '#4A6B63', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
