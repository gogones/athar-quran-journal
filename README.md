# Athar — أثر

> *A daily Quran reflection journal. Build a lasting connection beyond Ramadan, one verse at a time.*

Athar (Arabic: trace, mark) is a mobile app for Muslims who want to maintain a meaningful relationship with the Quran after Ramadan. Each day, one verse. One reflection. One step toward a lasting habit.

Built for the **Quran Foundation Hackathon 2026**.

---

## Download

**[Install on Android →](https://expo.dev/accounts/gogones/projects/athar/builds/152ac649-0a26-4e07-9772-6436e2b2ad07)**

---

## Features

- **Verse of the Day** — cycles through all 6,236 verses of the Quran, one per day
- **Tafsir** — read Ibn Kathir's commentary for each verse, expandable inline
- **Daily Reflection** — write your personal thoughts on the verse in a private journal
- **Streak Tracking** — stay consistent with a daily streak counter and milestone celebrations (7, 30, 100 days)
- **Journal History** — browse all past reflections with full-text search
- **Share** — share any verse and reflection with others
- **Daily Reminders** — optional push notification at a time you choose
- **Offline Support** — last fetched verse is cached, readable without internet
- **Onboarding** — guided first-launch flow explaining the app's purpose

---

## Screenshots

| Today | Journal | Settings |
|-------|---------|----------|
| Verse of the day with Arabic text, translation, and reflection input | History of all past reflections with search | Daily reminder toggle with time picker |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo 54 / React Native 0.81 |
| Navigation | expo-router (file-based, tab layout) |
| Storage | @react-native-async-storage/async-storage |
| Notifications | expo-notifications |
| Font | Amiri (Arabic) via @expo-google-fonts/amiri |
| Haptics | expo-haptics |
| API | Quran Foundation Content API (verses, tafsir) |

---

## API Usage

This app uses the **Quran Foundation Content API**:

- `GET /verses/by_key/:key` — fetch verse with Uthmani text and translation
- `GET /tafsirs/169/by_ayah/:key` — fetch Ibn Kathir tafsir (English)

---

## Running Locally

```bash
git clone https://github.com/gogones/athar-quran-journal.git
cd athar-quran-journal
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

---

## Project Structure

```
app/
  _layout.tsx        # Tab navigation + font loading + onboarding gate
  index.tsx          # Today screen (verse + reflection)
  history.tsx        # Journal history with search
  settings.tsx       # Notification settings
  onboarding.tsx     # First-launch onboarding slides
  entry/[id].tsx     # Entry detail + share
components/
  AyahCard.tsx       # Verse card with tafsir toggle
  AyahCardSkeleton   # Shimmer loading state
  ReflectionInput.tsx
  StreakBadge.tsx
services/
  quranApi.ts        # Verse + tafsir fetching with offline cache
  notifications.ts   # Daily reminder scheduling
hooks/
  useJournal.ts
  useStreak.ts
utils/
  storage.ts         # AsyncStorage helpers
```

---

## Hackathon

**Event:** Quran Foundation Hackathon 2026
**Category:** Streak + Reflection Journal
**Judging focus:** Post-Ramadan habit retention (Impact — 30pts)

---

*Made with care by [Gogones](https://github.com/gogones)*
