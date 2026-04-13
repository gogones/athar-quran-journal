import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { JournalEntry } from '../utils/storage';

interface Props {
  entries: JournalEntry[];
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAYS_SHOWN = 28;

export default function ProgressCalendar({ entries }: Props) {
  const entryDates = new Set(entries.map(e => e.date));

  // Build last 28 days ending today, padded to start on Monday
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: { date: string; isToday: boolean; inRange: boolean }[] = [];

  // Start from 27 days ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (DAYS_SHOWN - 1));

  // Pad back to the nearest Monday
  const dayOfWeek = startDate.getDay(); // 0=Sun, 1=Mon...
  const paddingDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const gridStart = new Date(startDate);
  gridStart.setDate(startDate.getDate() - paddingDays);

  // Build grid until we've passed today
  const current = new Date(gridStart);
  while (current <= today || days.length % 7 !== 0) {
    const dateStr = current.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      isToday: dateStr === today.toISOString().split('T')[0],
      inRange: current >= startDate && current <= today,
    });
    current.setDate(current.getDate() + 1);
    if (days.length > 49) break; // safety cap
  }

  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const reflectedCount = days.filter(d => d.inRange && entryDates.has(d.date)).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Last 28 Days</Text>
        <Text style={styles.count}>
          <Text style={styles.countNum}>{reflectedCount}</Text>
          <Text style={styles.countOf}> / {DAYS_SHOWN} reflected</Text>
        </Text>
      </View>

      <View style={styles.dayLabels}>
        {DAY_LABELS.map((d, i) => (
          <Text key={i} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.week}>
          {week.map((day, di) => {
            const hasEntry = entryDates.has(day.date);
            return (
              <View
                key={di}
                style={[
                  styles.cell,
                  !day.inRange && styles.cellOutOfRange,
                  day.inRange && !hasEntry && styles.cellMissed,
                  day.inRange && hasEntry && styles.cellReflected,
                  day.isToday && styles.cellToday,
                ]}
              >
                {day.isToday && <View style={styles.todayDot} />}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  count: {},
  countNum: { color: '#1DB954', fontSize: 13, fontWeight: '700' },
  countOf: { color: '#4A6B63', fontSize: 13 },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayLabel: {
    color: '#4A6B63',
    fontSize: 11,
    fontWeight: '600',
    width: 28,
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  cell: {
    width: 28,
    height: 28,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellOutOfRange: {
    backgroundColor: 'transparent',
  },
  cellMissed: {
    backgroundColor: '#0D1F1A',
  },
  cellReflected: {
    backgroundColor: '#1DB954',
  },
  cellToday: {
    borderWidth: 2,
    borderColor: '#1DB954',
    backgroundColor: '#0D1F1A',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1DB954',
  },
});
