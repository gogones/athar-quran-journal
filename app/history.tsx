import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { JournalEntry } from '../utils/storage';
import { useJournal } from '../hooks/useJournal';
import ProgressCalendar from '../components/ProgressCalendar';

function EntryCard({ entry }: { entry: JournalEntry }) {
  const router = useRouter();
  const date = new Date(entry.date + 'T00:00:00');
  const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/entry/${entry.id}`)}>
      <View style={styles.cardHeader}>
        <Text style={styles.verseKey}>{entry.verseKey}</Text>
        <Text style={styles.entryDate}>{formatted}</Text>
      </View>
      <Text style={styles.translation} numberOfLines={2}>{entry.translation}</Text>
      <View style={styles.divider} />
      <Text style={styles.reflection} numberOfLines={3}>{entry.reflection}</Text>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const { entries, loading } = useJournal();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(e =>
      e.reflection.toLowerCase().includes(q) ||
      e.verseKey.toLowerCase().includes(q) ||
      e.translation.toLowerCase().includes(q)
    );
  }, [entries, query]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Journal</Text>
        <Text style={styles.subtitle}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search reflections, verses..."
          placeholderTextColor="#4A6B63"
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.calendarContainer}>
        <ProgressCalendar entries={entries} />
      </View>

      {entries.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyText}>No reflections yet.</Text>
          <Text style={styles.emptySubtext}>Save your first one from Today's tab.</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No results for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <EntryCard entry={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1F1A' },
  header: { padding: 20, paddingBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#4A6B63', fontSize: 13, marginTop: 2 },
  searchContainer: { paddingHorizontal: 20, paddingBottom: 12 },
  searchInput: {
    backgroundColor: '#1A2E28',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  calendarContainer: { paddingHorizontal: 20, paddingBottom: 4 },
  list: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  card: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verseKey: { color: '#1DB954', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  entryDate: { color: '#4A6B63', fontSize: 12 },
  translation: { color: '#8AABA3', fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: '#0D2A22', marginVertical: 12 },
  reflection: { color: '#FFFFFF', fontSize: 15, lineHeight: 23 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyText: { color: '#8AABA3', fontSize: 16, fontWeight: '600' },
  emptySubtext: { color: '#4A6B63', fontSize: 13 },
});
