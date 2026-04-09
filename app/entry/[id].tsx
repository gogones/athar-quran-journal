import React from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJournal } from '../../hooks/useJournal';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries } = useJournal();
  const router = useRouter();

  const entry = entries.find(e => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Entry not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Date(entry.date + 'T00:00:00');
  const formatted = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  async function handleShare() {
    await Share.share({
      message: `${entry.verseKey}\n\n${entry.verseText}\n\n"${entry.translation}"\n\n— My reflection:\n${entry.reflection}\n\n#Athar #Quran`,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareBtn}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.date}>{formatted}</Text>
        <Text style={styles.verseKey}>{entry.verseKey}</Text>

        <View style={styles.card}>
          <Text style={styles.arabic}>{entry.verseText}</Text>
          <View style={styles.divider} />
          <Text style={styles.translation}>{entry.translation}</Text>
        </View>

        <Text style={styles.sectionLabel}>My Reflection</Text>
        <View style={styles.reflectionCard}>
          <Text style={styles.reflection}>{entry.reflection}</Text>
        </View>
      </ScrollView>
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
    paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  backBtnText: { color: '#1DB954', fontSize: 15, fontWeight: '600' },
  shareBtn: { color: '#1DB954', fontSize: 15, fontWeight: '600' },
  content: { padding: 20, paddingTop: 4, paddingBottom: 40 },
  date: { color: '#4A6B63', fontSize: 13, marginBottom: 4 },
  verseKey: { color: '#1DB954', fontSize: 13, fontWeight: '600', letterSpacing: 1, marginBottom: 16 },
  card: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  arabic: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 44,
    textAlign: 'right',
    fontFamily: 'Amiri_400Regular',
    marginBottom: 16,
  },
  divider: { height: 1, backgroundColor: '#0D2A22', marginBottom: 16 },
  translation: { color: '#C8D8D4', fontSize: 15, lineHeight: 24, fontStyle: 'italic' },
  sectionLabel: {
    color: '#4A6B63',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  reflectionCard: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 16,
  },
  reflection: { color: '#FFFFFF', fontSize: 15, lineHeight: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFound: { color: '#8AABA3', fontSize: 16 },
});
