// components/SwapCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function SwapCard({ item, isMine, onAccept, onCancel }) {
  return (
    <View style={styles.card}>
      <Text style={styles.code}>{item.courseCode}</Text>
      <Text style={styles.name}>{item.courseName}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detail}>
          Offered Sec: <Text style={styles.bold}>{item.currentSection}</Text>
        </Text>
        <Text style={styles.detail}>
          Wants Sec: <Text style={styles.bold}>{item.desiredSection}</Text>
        </Text>
      </View>
      <Text style={styles.postedBy}>Posted by: {item.offeredBy}</Text>

      {isMine ? (
        <TouchableOpacity style={styles.cancelButton} onPress={() => onCancel(item)}>
          <Text style={styles.cancelButtonText}>Cancel Offer</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(item)}>
          <Text style={styles.acceptButtonText}>Accept & Swap</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 12, elevation: 2 },
  code: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  name: { fontSize: 14, color: '#4B5563', marginVertical: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  detail: { fontSize: 13, color: '#374151' },
  bold: { fontWeight: 'bold' },
  postedBy: { fontSize: 11, color: colors.muted, marginBottom: 8 },
  acceptButton: { backgroundColor: colors.success, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  acceptButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  cancelButton: { borderWidth: 1, borderColor: colors.danger, paddingVertical: 9, borderRadius: 6, alignItems: 'center' },
  cancelButtonText: { color: colors.danger, fontSize: 13, fontWeight: 'bold' },
});