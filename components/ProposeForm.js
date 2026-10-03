// components/ProposeForm.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ProposeForm({
  courses,
  selectedCourseId,
  onSelectCourse,
  desiredSection,
  onChangeDesiredSection,
  formError,
  onSubmit,
}) {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.sectionHeader}>Propose Section Trade</Text>

      {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

      <Text style={styles.label}>1. Select Enrolled Course:</Text>
      <View style={styles.radioGroup}>
        {courses.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.radioOption, selectedCourseId === c.id && styles.radioOptionSelected]}
            onPress={() => onSelectCourse(c.id)}
          >
            <Text style={selectedCourseId === c.id ? styles.radioTextSelected : styles.radioText}>
              {c.code} ({c.section})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>2. Enter Target Section You Want:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., CS-B or EE-A"
        value={desiredSection}
        onChangeText={onChangeDesiredSection}
        autoCapitalize="characters"
        maxLength={10}
      />

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Publish Swap Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: '#F9FAFB' },
  radioGroup: { gap: 8 },
  radioOption: { padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  radioOptionSelected: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  radioText: { fontSize: 13, color: '#374151' },
  radioTextSelected: { fontSize: 13, color: colors.primary, fontWeight: 'bold' },
  submitButton: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  errorText: { color: '#DC2626', fontSize: 12, marginBottom: 8 },
});