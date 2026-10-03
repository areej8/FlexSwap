// components/ScheduleBanner.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MIN_CREDITS } from '../data/mockData';
import { colors } from '../theme';

// Uses a Fragment (<>...</>) since it needs to return two sibling banners
// without introducing an unnecessary wrapping <View>.
export default function ScheduleBanner({ totalCredits, valid, pendingReReg }) {
  return (
    <>
      <View style={styles.banner}>
        <Text style={styles.text}>
          Total Credits: <Text style={styles.bold}>{totalCredits} CH</Text> | Status:{' '}
          <Text style={valid ? styles.valid : styles.invalid}>
            {valid ? 'Valid Schedule' : 'Below Minimum Threshold'}
          </Text>
        </Text>
      </View>

      {pendingReReg.length > 0 && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚠ {pendingReReg.join(', ')} dropped below the {MIN_CREDITS} CH floor — will be auto
            re-registered after the deadline unless your total credit hours are back to {MIN_CREDITS}+ before then.
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: colors.primary, marginBottom: 12 },
  text: { fontSize: 13, color: '#1E40AF' },
  bold: { fontWeight: 'bold' },
  valid: { color: '#059669', fontWeight: 'bold' },
  invalid: { color: '#DC2626', fontWeight: 'bold' },
  warningBanner: { backgroundColor: '#FFFBEB', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#F59E0B', marginBottom: 12 },
  warningText: { fontSize: 12, color: '#92400E' },
});