import React, { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  cancelDailyReminder,
  getScheduledReminder,
  scheduleDailyReminder,
} from '../services/notifications';
import {
  AuthToken,
  UserProfile,
  clearToken,
  exchangeCodeForToken,
  fetchUserProfile,
  getStoredProfile,
  getStoredToken,
  isLoggedIn,
  useQuranAuth,
} from '../services/auth';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function formatTime(hour: number, minute: number) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:${pad(minute)} ${ampm}`;
}

WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const { request, response, promptAsync, redirectUri } = useQuranAuth();

  useEffect(() => {
    getScheduledReminder().then(reminder => {
      if (reminder) {
        setEnabled(true);
        setHour(reminder.hour);
        setMinute(reminder.minute);
      }
    });
    getStoredToken().then(setAuthToken);
    getStoredProfile().then(setUserProfile);
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code, redirectUri, request?.codeVerifier)
        .then(token => {
          setAuthToken(token);
          return fetchUserProfile(token);
        })
        .then(profile => {
          setUserProfile(profile);
          const name = profile.name ?? profile.email ?? 'your account';
          Alert.alert('Connected!', `Welcome, ${name}! Your Quran.com account is now linked.`);
        })
        .catch(() => Alert.alert('Error', 'Failed to connect account. Please try again.'));
    }
  }, [response]);

  async function handleDisconnect() {
    Alert.alert('Disconnect', 'Remove your Quran.com account from Athar?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect', style: 'destructive', onPress: async () => {
          await clearToken();
          setAuthToken(null);
          setUserProfile(null);
        }
      },
    ]);
  }

  async function handleToggle(value: boolean) {
    setEnabled(value);
    if (value) {
      await scheduleDailyReminder(hour, minute);
      Alert.alert('Reminder set', `You'll be reminded daily at ${formatTime(hour, minute)}`);
    } else {
      await cancelDailyReminder();
    }
  }

  async function handleTimeChange(newHour: number, newMinute: number) {
    setHour(newHour);
    setMinute(newMinute);
    if (enabled) {
      await scheduleDailyReminder(newHour, newMinute);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* Daily Reminder */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Daily Reminder</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>Enable reminder</Text>
              <Text style={styles.rowSub}>Get a daily nudge to reflect</Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#1A2E28', true: '#1DB954' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {enabled && (
            <>
              <Text style={styles.timeLabel}>Reminder time: {formatTime(hour, minute)}</Text>

              <Text style={styles.pickerLabel}>Hour</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.picker}>
                {HOURS.map(h => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.chip, h === hour && styles.chipActive]}
                    onPress={() => handleTimeChange(h, minute)}
                  >
                    <Text style={[styles.chipText, h === hour && styles.chipTextActive]}>
                      {pad(h)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.pickerLabel}>Minute</Text>
              <View style={styles.minuteRow}>
                {MINUTES.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.chip, m === minute && styles.chipActive]}
                    onPress={() => handleTimeChange(hour, m)}
                  >
                    <Text style={[styles.chipText, m === minute && styles.chipTextActive]}>
                      :{pad(m)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Quran Account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quran Account</Text>
<View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>
                {isLoggedIn(authToken) ? 'Connected' : 'Connect Quran.com'}
              </Text>
              {isLoggedIn(authToken) && userProfile?.name ? (
                <Text style={styles.rowSub}>{userProfile.name}</Text>
              ) : isLoggedIn(authToken) && userProfile?.email ? (
                <Text style={styles.rowSub}>{userProfile.email}</Text>
              ) : (
                <Text style={styles.rowSub}>
                  {isLoggedIn(authToken) ? 'Your account is linked' : 'Sync your streak and reflections'}
                </Text>
              )}
            </View>
            {isLoggedIn(authToken) ? (
              <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectBtn}>
                <Text style={styles.disconnectBtnText}>Disconnect</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => promptAsync()}
                disabled={!request}
                style={styles.connectBtn}
              >
                <Text style={styles.connectBtnText}>Connect</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>Athar</Text>
            <Text style={styles.aboutText}>
              A daily Quran reflection journal. Build a lasting connection beyond Ramadan, one verse at a time.
            </Text>
            <Text style={styles.version}>v1.0.0 · Quran Foundation Hackathon 2026</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D1F1A' },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 28 },
  section: { marginBottom: 32 },
  sectionLabel: {
    color: '#4A6B63',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  rowSub: { color: '#4A6B63', fontSize: 12, marginTop: 2 },
  timeLabel: {
    color: '#1DB954',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerLabel: { color: '#8AABA3', fontSize: 12, marginTop: 12, marginBottom: 8 },
  picker: { flexDirection: 'row' },
  minuteRow: { flexDirection: 'row', gap: 8 },
  chip: {
    backgroundColor: '#1A2E28',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#1DB954' },
  chipText: { color: '#8AABA3', fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#0D1F1A' },
  connectBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  connectBtnText: { color: '#0D1F1A', fontWeight: '700', fontSize: 13 },
  disconnectBtn: {
    backgroundColor: '#1A2E28',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  disconnectBtnText: { color: '#FF6B6B', fontWeight: '600', fontSize: 13 },
  aboutCard: { backgroundColor: '#1A2E28', borderRadius: 16, padding: 16 },
  appName: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  aboutText: { color: '#8AABA3', fontSize: 14, lineHeight: 22 },
  version: { color: '#4A6B63', fontSize: 12, marginTop: 12 },
});
