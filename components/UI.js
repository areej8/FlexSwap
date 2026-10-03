// components/UI.js
// Small, generic pieces shared across views. They only know about the props
// they receive, not about courses or swaps.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export function Badge({ label, tone = 'default' }) {
  return (
    <View style={[styles.badge, badgeTones[tone] || badgeTones.default]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function EmptyState({ message }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// A pill-shaped button that is filled when `active` is true.
export function SwitcherChip({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Renders one chip per view. Pressing a chip reports its key through
// onChangeView; App.js stores it in `currentView` and conditionally renders
// the matching content.
export function ViewSwitcher({ currentView, onChangeView, marketCount }) {
  const views = [
    { key: 'courses', label: 'My Schedule' },
    { key: 'marketplace', label: `Market (${marketCount})` },
    { key: 'propose', label: '+ Trade' },
    { key: 'dashboard', label: 'Analytics' },
  ];
  return (
    <View style={styles.switcher}>
      {views.map((view) => (
        <SwitcherChip
          key={view.key}
          label={view.label}
          active={currentView === view.key}
          onPress={() => onChangeView(view.key)}
        />
      ))}
    </View>
  );
}

const badgeTones = {
  default: { backgroundColor: '#E5E7EB' },
  core: { backgroundColor: '#D1FAE5' },
  must: { backgroundColor: '#FEE2E2' },
  elective: { backgroundColor: '#DBEAFE' },
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: colors.text },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyText: { color: colors.muted, fontSize: 14 },
  switcher: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  chipTextActive: { color: '#FFFFFF' },
});