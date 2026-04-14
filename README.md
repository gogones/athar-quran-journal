# Athar — أثر

> *A daily Quran reflection journal. Build a lasting connection beyond Ramadan, one verse at a time.*

Athar (Arabic: trace, mark) is a mobile app for Muslims who want to maintain a meaningful relationship with the Quran after Ramadan. Each day, one verse. One reflection. One step toward a lasting habit.

Built for the **Quran Foundation Hackathon 2026**.

---

## Download

**[Install on Android →](https://expo.dev/accounts/gogones/projects/athar/builds/ce8a5780-0732-408e-9fe6-a3ff944ffaff)**

---

## Features

- **Verse of the Day** — cycles through all 6,236 verses of the Quran, one per day
- **Tafsir** — read Ibn Kathir's commentary for each verse, expandable inline
- **Daily Reflection** — write your personal thoughts on the verse in a private journal
- **Streak Tracking** — stay consistent with a daily streak counter and milestone celebrations (7, 30, 100 days)
- **Streak Reset Feedback** — gentle reminder when a day is missed, with encouragement to restart
- **Journal History** — browse all past reflections with full-text search
- **Entry Detail** — tap any journal entry to read it in full, with share support
- **Share** — share any verse and reflection with others
- **Daily Reminders** — optional push notification at a custom time
- **Offline Support** — last fetched verse is cached, readable without internet
- **Flashcard Review** — tap-to-flip cards built from your own reflections, reinforcing verses you've studied
- **Quran.com Account** — connect your Quran Foundation account to link your identity
- **Onboarding** — guided first-launch flow explaining the app's purpose

---

## Screenshots

| Today | Journal | Settings |
|-------|---------|----------|
| Verse of the day with Arabic text, translation, tafsir, and reflection input | History of all past reflections with search | Daily reminder toggle, time picker, and Quran.com account connection |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo 54 / React Native 0.81 |
| Navigation | expo-router (file-based, tab layout) |
| Storage | @react-native-async-storage/async-storage |
| Notifications | expo-notifications |
| Auth | expo-auth-session + expo-web-browser (OAuth2 PKCE) |
| Font | Amiri (Arabic) via @expo-google-fonts/amiri |
| Haptics | expo-haptics |
| Content API | Quran Foundation Content API (verses, tafsir) |
| Auth API | Quran Foundation OAuth2 (pre-live) |

---

## API Usage

This app integrates with two **Quran Foundation APIs**:

### Content API
- `GET /verses/by_key/:key` — fetch verse with Uthmani script and translation
- `GET /tafsirs/169/by_ayah/:key` — fetch Ibn Kathir tafsir (English)

### OAuth2 API
- Authorization Code flow with PKCE
- Scopes: `openid profile email`
- Endpoints: `https://prelive-oauth2.quran.foundation/oauth2/`
- After login: fetches `/userinfo` to display the user's name in Settings

---

## Running Locally

```bash
git clone https://github.com/gogones/athar-quran-journal.git
cd athar-quran-journal
npm install --legacy-peer-deps
```

Create a `.env` file with your Quran Foundation OAuth credentials:

```env
EXPO_PUBLIC_QURAN_CLIENT_ID=your_client_id
EXPO_PUBLIC_QURAN_CLIENT_SECRET=your_client_secret
EXPO_PUBLIC_QURAN_TOKEN_ENDPOINT=https://prelive-oauth2.quran.foundation/oauth2/token
```

Then start the dev server:

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or build a development APK via EAS.

---

## Project Structure

```
app/
  _layout.tsx        # Tab navigation + font loading + onboarding gate
  index.tsx          # Today screen (verse + reflection + streak)
  history.tsx        # Journal history with search
  settings.tsx       # Reminder settings + Quran.com account
  onboarding.tsx     # First-launch onboarding slides
  entry/[id].tsx     # Entry detail + share
components/
  AyahCard.tsx       # Verse card with Arabic text, translation, tafsir toggle
  AyahCardSkeleton   # Shimmer loading state
  ReflectionInput.tsx
  StreakBadge.tsx
services/
  auth.ts            # Quran Foundation OAuth2 + token storage + userinfo
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
