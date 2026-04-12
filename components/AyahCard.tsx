import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tafsir, fetchTafsir } from '../services/quranApi';

interface Props {
  verseKey: string;
  arabic: string;
  translation: string;
}

export default function AyahCard({ verseKey, arabic, translation }: Props) {
  const [tafsir, setTafsir] = useState<Tafsir | null>(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [expandedTafsir, setExpandedTafsir] = useState(false);

  async function toggleTafsir() {
    if (showTafsir) { setShowTafsir(false); return; }
    if (tafsir) { setShowTafsir(true); return; }
    setLoadingTafsir(true);
    try {
      const t = await fetchTafsir(verseKey);
      setTafsir(t);
      setShowTafsir(true);
    } catch {
      // fail silently — tafsir is optional
    } finally {
      setLoadingTafsir(false);
    }
  }

  // Strip HTML tags from tafsir text
  const cleanTafsir = tafsir?.text.replace(/<[^>]*>/g, '') ?? '';

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.verseKey}>{verseKey}</Text>
      </View>

      {/* Bismillah — shown for all verses except Al-Fatiha (1:1) and At-Tawbah (9:x) */}
      {verseKey !== '1:1' && !verseKey.startsWith('9:') && (
        <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
      )}

      <Text style={styles.arabic}>{arabic}</Text>

      <View style={styles.divider} />

      <Text style={styles.translation}>{translation}</Text>

      <TouchableOpacity onPress={toggleTafsir} style={styles.tafsirBtn} disabled={loadingTafsir}>
        {loadingTafsir
          ? <ActivityIndicator size="small" color="#1DB954" />
          : <Text style={styles.tafsirBtnText}>{showTafsir ? 'Hide tafsir' : 'Read tafsir'}</Text>
        }
      </TouchableOpacity>

      {showTafsir && (
        <>
          <Text style={styles.tafsirText} numberOfLines={expandedTafsir ? undefined : 8}>
            {cleanTafsir}
          </Text>
          <TouchableOpacity onPress={() => setExpandedTafsir(v => !v)} style={styles.expandBtn}>
            <Text style={styles.expandBtnText}>{expandedTafsir ? 'Show less' : 'Read more'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseKey: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  bismillah: {
    color: '#4A6B63',
    fontSize: 16,
    fontFamily: 'Amiri_400Regular',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#0D2A22',
    marginVertical: 14,
  },
  arabic: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 44,
    textAlign: 'right',
    fontFamily: 'Amiri_400Regular',
  },
  translation: {
    color: '#C8D8D4',
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  tafsirBtn: {
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  tafsirBtnText: {
    color: '#1DB954',
    fontSize: 13,
    fontWeight: '600',
  },
  tafsirText: {
    marginTop: 12,
    color: '#8AABA3',
    fontSize: 13,
    lineHeight: 20,
  },
  expandBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  expandBtnText: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '600',
  },
});
