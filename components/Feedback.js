// components/Feedback.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

const TONES = {
  error: { backgroundColor: '#FEF2F2', borderLeftColor: colors.danger, color: '#991B1B' },
  warning: { backgroundColor: '#FFFBEB', borderLeftColor: colors.warning, color: '#92400E' },
  success: { backgroundColor: '#ECFDF5', borderLeftColor: colors.success, color: '#065F46' },
};

// Inline message banner. `feedback` is { type, title, message } or null;
// nothing is rendered when it is null.
export default function Feedback({ feedback, onDismiss }) {
  if (!feedback) return null;

  const tone = TONES[feedback.type] || TONES.success;

  return (
    <View style={[styles.banner, { backgroundColor: tone.backgroundColor, borderLeftColor: tone.borderLeftColor }]}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: tone.color }]}>{feedback.title}</Text>
        <Text style={[styles.message, { color: tone.color }]}>{feedback.message}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.dismiss}>
        <Text style={[styles.dismissText, { color: tone.color }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  body: { flex: 1 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  message: { fontSize: 12 },
  dismiss: { paddingLeft: 12, paddingVertical: 2 },
  dismissText: { fontSize: 14, fontWeight: 'bold' },
});
