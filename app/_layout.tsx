import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useFonts, Amiri_400Regular } from '@expo-google-fonts/amiri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermission } from '../services/notifications';

export default function Layout() {
  const [fontsLoaded] = useFonts({ Amiri_400Regular });
  const [checkingOnboard, setCheckingOnboard] = useState(true);
  const router = useRouter();

  useEffect(() => {
    requestNotificationPermission();
    AsyncStorage.getItem('athar:onboarded').then(value => {
      if (!value) router.replace('/onboarding');
      setCheckingOnboard(false);
    });
  }, []);

  if (!fontsLoaded || checkingOnboard) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D1F1A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#1DB954" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: '#4A6B63',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>☀️</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📖</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
        }}
      />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
      <Tabs.Screen name="entry/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0D1F1A',
    borderTopColor: '#1A2E28',
    borderTopWidth: 1,
    paddingBottom: 8,
    height: 60,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
