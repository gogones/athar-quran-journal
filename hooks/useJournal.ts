import { useCallback, useEffect, useState } from 'react';
import { JournalEntry, getJournalEntries, getTodayEntry, saveJournalEntry, updateStreak } from '../utils/storage';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [all, today] = await Promise.all([getJournalEntries(), getTodayEntry()]);
    setEntries(all);
    setTodayEntry(today);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (
    entry: Omit<JournalEntry, 'id' | 'createdAt'>
  ): Promise<{ entry: JournalEntry; newStreak: number }> => {
    const saved = await saveJournalEntry(entry);
    const newStreak = await updateStreak();
    setTodayEntry(saved);
    setEntries(prev => [saved, ...prev.filter(e => e.date !== entry.date)]);
    return { entry: saved, newStreak };
  }, []);

  return { entries, todayEntry, loading, save, reload: load };
}
