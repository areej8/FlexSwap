// components/CourseCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from './UI';
import { isDropLocked } from '../utils/rules';
import { colors } from '../theme';

const TONE_BY_TYPE = { Core: 'core', 'Must-Take': 'must', Elective: 'elective' };

// One course row, rendered from the `course` prop. The drop button is greyed
// out and labelled "Locked" for Core/Must-Take courses.
export default function CourseCard({ course, onDrop }) {
  const locked = isDropLocked(course);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.code}>{course.code}</Text>
        <View style={styles.badgeGroup}>
          {course.type === 'Elective' && course.group ? <Badge label={course.group} tone="default" /> : null}
          <Badge label={course.type} tone={TONE_BY_TYPE[course.type]} />
        </View>
      </View>

      <Text style={styles.name}>{course.name}</Text>
      <Text style={styles.meta}>
        Section: {course.section} · Credits: {course.credits} CH{course.isLab ? ' · Lab' : ''}
      </Text>

      <TouchableOpacity style={[styles.dropButton, locked && styles.disabledButton]} onPress={() => onDrop(course)}>
        <Text style={styles.dropButtonText}>{locked ? 'Locked (FLEX Policy)' : 'Drop Course'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 12, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeGroup: { flexDirection: 'row', gap: 6 },
  code: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  name: { fontSize: 14, color: '#4B5563', marginVertical: 4 },
  meta: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  dropButton: { backgroundColor: colors.danger, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  disabledButton: { backgroundColor: '#9CA3AF' },
  dropButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});