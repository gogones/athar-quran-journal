import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.qurancdn.com/api/v4';
const CACHE_KEY = 'athar:cached_verse';

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations: { text: string }[];
}

export interface Tafsir {
  text: string;
  resource_name: string;
}

// ── Daily Verse ───────────────────────────────────────────
// Cycles through all 6236 verses, one per day

export function getDailyVerseNumber(): number {
  const start = new Date('2026-04-09').getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayIndex = Math.floor((today.getTime() - start) / 86400000);
  return (dayIndex % 6236) + 1;
}

export async function fetchDailyVerse(): Promise<Verse> {
  const verseKey = verseNumberToKey(getDailyVerseNumber());
  try {
    const res = await fetch(
      `${BASE_URL}/verses/by_key/${verseKey}?translations=20&fields=text_uthmani`
    );
    if (!res.ok) throw new Error(`Failed to fetch verse: ${res.status}`);
    const data = await res.json();
    const verse = data.verse;
    if (verse.translations) {
      verse.translations = verse.translations.map((t: { text: string }) => ({
        ...t,
        text: t.text.replace(/<[^>]*>/g, ''),
      }));
    }
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(verse));
    return verse;
  } catch (err) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    throw err;
  }
}

// ── Tafsir ────────────────────────────────────────────────

export async function fetchTafsir(verseKey: string): Promise<Tafsir> {
  // 169 = Tafsir Ibn Kathir (English)
  const res = await fetch(`${BASE_URL}/tafsirs/169/by_ayah/${verseKey}`);
  if (!res.ok) throw new Error(`Failed to fetch tafsir: ${res.status}`);
  const data = await res.json();
  return data.tafsir;
}

// ── Helper: sequential verse number → surah:ayah key ─────

function verseNumberToKey(n: number): string {
  const surahLengths = [
    7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
    112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,
    59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,
    52,52,44,28,28,20,56,40,31,50,22,33,30,26,24,42,57,40,15,19,26,30,20,15,
    21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6,
  ];
  let cumulative = 0;
  for (let s = 0; s < surahLengths.length; s++) {
    if (n <= cumulative + surahLengths[s]) return `${s + 1}:${n - cumulative}`;
    cumulative += surahLengths[s];
  }
  return '1:1';
}
