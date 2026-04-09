import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AyahCard from '../components/AyahCard';
import ReflectionInput from '../components/ReflectionInput';
import StreakBadge from '../components/StreakBadge';
import { fetchDailyVerse, Verse } from '../services/quranApi';
import { useJournal } from '../hooks/useJournal';
import { useStreak } from '../hooks/useStreak';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function HomeScreen() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [verseError, setVerseError] = useState(false);

  const { todayEntry, save } = useJournal();
  const { streak, setStreak } = useStreak();

  useEffect(() => {
    fetchDailyVerse()
      .then(setVerse)
      .catch(() => setVerseError(true))
      .finally(() => setLoadingVerse(false));
  }, []);

  async function handleSave(text: string) {
    if (!verse) return;
    const { newStreak } = await save({
      date: new Date().toISOString().split('T')[0],
      verseKey: verse.verse_key,
      verseText: verse.text_uthmani,
      translation: verse.translations?.[0]?.text ?? '',
      reflection: text,
    });
    setStreak(newStreak);
    if (newStreak > 1) {
      Alert.alert('🔥 Streak!', `You've reflected for ${newStreak} days in a row. Keep going!`);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <StreakBadge streak={streak} />
        </View>

        <Text style={styles.sectionLabel}>Verse of the Day</Text>

        {/* Ayah */}
        {loadingVerse ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#1DB954" />
          </View>
        ) : verseError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Could not load verse. Check your connection.</Text>
          </View>
        ) : verse ? (
          <AyahCard
            verseKey={verse.verse_key}
            arabic={verse.text_uthmani}
            translation={verse.translations?.[0]?.text ?? ''}
          />
        ) : null}

        {/* Reflection */}
        {!loadingVerse && !verseError && (
          <>
            <Text style={styles.sectionLabel}>Reflect</Text>
            <ReflectionInput
              initialValue={todayEntry?.reflection}
              onSave={handleSave}
              saved={!!todayEntry}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1F1A' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  date: { color: '#8AABA3', fontSize: 13, marginTop: 2 },
  sectionLabel: {
    color: '#4A6B63',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  loadingBox: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    marginBottom: 20,
  },
  errorBox: {
    padding: 20,
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    marginBottom: 20,
  },
  errorText: { color: '#FF6B6B', textAlign: 'center' },
});
