import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = process.env.EXPO_PUBLIC_QURAN_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_QURAN_CLIENT_SECRET ?? '';
const TOKEN_ENDPOINT = process.env.EXPO_PUBLIC_QURAN_TOKEN_ENDPOINT ?? 'https://prelive-oauth2.quran.foundation/oauth2/token';

// Pre-live auth base URL
const AUTH_BASE = 'https://prelive-oauth2.quran.foundation/oauth2';

const STORAGE_KEY = 'athar:auth_token';
const PROFILE_KEY = 'athar:user_profile';

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number; // timestamp ms
  scope?: string;
}

export interface UserProfile {
  sub: string;
  email?: string;
  name?: string;
}

// Discovery document for expo-auth-session
const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: `${AUTH_BASE}/auth`,
  tokenEndpoint: TOKEN_ENDPOINT,
  revocationEndpoint: `${AUTH_BASE}/revoke`,
};

// ── Token storage ─────────────────────────────────────────

export async function getStoredToken(): Promise<AuthToken | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const token: AuthToken = JSON.parse(raw);
  if (Date.now() > token.expires_at) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return null;
  }
  return token;
}

async function storeToken(token: AuthSession.TokenResponse): Promise<AuthToken> {
  const stored: AuthToken = {
    access_token: token.accessToken,
    token_type: token.tokenType ?? 'Bearer',
    expires_in: token.expiresIn ?? 3600,
    expires_at: Date.now() + (token.expiresIn ?? 3600) * 1000,
    scope: token.scope ?? undefined,
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  return stored;
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.multiRemove([STORAGE_KEY, PROFILE_KEY]);
}

// ── User profile ──────────────────────────────────────────

export async function getStoredProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function fetchUserProfile(token: AuthToken): Promise<UserProfile> {
  const res = await fetch(`${AUTH_BASE}/userinfo`, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  const profile: UserProfile = await res.json();
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function isLoggedIn(token: AuthToken | null): boolean {
  return !!token && Date.now() < token.expires_at;
}

// ── Auth flow ─────────────────────────────────────────────

export function useQuranAuth() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'athar',
    path: 'oauth',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      usePKCE: true,
    },
    discovery
  );

  return { request, response, promptAsync, redirectUri };
}

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<AuthToken> {
  const token = await AuthSession.exchangeCodeAsync(
    {
      clientId: CLIENT_ID,
      code,
      redirectUri,
      extraParams: {
        ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
      },
    },
    discovery
  );
  return storeToken(token);
}

// ── Authenticated API calls ───────────────────────────────

const API_BASE = 'https://staging.qurancdn.com/api/qdc/v4';

export async function apiFetch(path: string, token: AuthToken): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    headers: {
      'x-auth-token': token.access_token,
      'x-client-id': CLIENT_ID,
      'Content-Type': 'application/json',
    },
  });
}
