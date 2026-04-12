import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  initialValue?: string;
  onSave: (text: string) => Promise<void>;
  saved?: boolean;
}

export default function ReflectionInput({ initialValue = '', onSave, saved }: Props) {
  const [text, setText] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!text.trim()) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(true);
    await onSave(text.trim());
    setSaving(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your reflection</Text>
      <TextInput
        style={styles.input}
        placeholder="What did this verse mean to you today?"
        placeholderTextColor="#4A6B63"
        multiline
        value={text}
        onChangeText={setText}
        maxLength={500}
      />
      <View style={styles.footer}>
        <Text style={styles.charCount}>{text.length}/500</Text>
        <TouchableOpacity
          style={[styles.saveBtn, (!text.trim() || saving) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!text.trim() || saving}
        >
          {saving
            ? <ActivityIndicator size="small" color="#0D1F1A" />
            : <Text style={styles.saveBtnText}>{saved ? 'Update' : 'Save'}</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A2E28',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    color: '#8AABA3',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#0D2A22',
    paddingTop: 12,
  },
  charCount: { color: '#4A6B63', fontSize: 12 },
  saveBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: '#0D1F1A', fontWeight: '700', fontSize: 14 },
});
