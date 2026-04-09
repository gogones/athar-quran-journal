import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
  id: string;
  date: string;         // 'YYYY-MM-DD'
  verseKey: string;
  verseText: string;
  translation: string;
  reflection: string;
  createdAt: string;
}

const KEYS = {
  JOURNAL: 'athar:journal',
  STREAK: 'athar:streak',
  LAST_ACTIVE: 'athar:last_active',
  USER_ID: 'athar:user_id',
};

// ── Journal ──────────────────────────────────────────────

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.JOURNAL);
  return raw ? JSON.parse(raw) : [];
}

export async function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt'>): Promise<JournalEntry> {
  const entries = await getJournalEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  // Replace if same date already exists
  const filtered = entries.filter(e => e.date !== entry.date);
  await AsyncStorage.setItem(KEYS.JOURNAL, JSON.stringify([newEntry, ...filtered]));
  return newEntry;
}

export async function getTodayEntry(): Promise<JournalEntry | null> {
  const entries = await getJournalEntries();
  const today = getToday();
  return entries.find(e => e.date === today) ?? null;
}

// ── Streak ───────────────────────────────────────────────

export async function getStreak(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.STREAK);
  return raw ? parseInt(raw, 10) : 0;
}

export async function updateStreak(): Promise<number> {
  const today = getToday();
  const lastActive = await AsyncStorage.getItem(KEYS.LAST_ACTIVE);
  const currentStreak = await getStreak();

  if (lastActive === today) return currentStreak; // already counted today

  const yesterday = getDateOffset(-1);
  const newStreak = lastActive === yesterday ? currentStreak + 1 : 1;

  await AsyncStorage.setItem(KEYS.STREAK, newStreak.toString());
  await AsyncStorage.setItem(KEYS.LAST_ACTIVE, today);
  return newStreak;
}

// ── User ID ──────────────────────────────────────────────

export async function getUserId(): Promise<string> {
  let id = await AsyncStorage.getItem(KEYS.USER_ID);
  if (!id) {
    id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await AsyncStorage.setItem(KEYS.USER_ID, id);
  }
  return id;
}

// ── Helpers ──────────────────────────────────────────────

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
