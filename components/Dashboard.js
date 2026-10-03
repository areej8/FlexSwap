// components/Dashboard.js
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { buildCreditsByType, buildWeeklyLoad } from '../utils/rules';

const SCREEN_WIDTH = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.6,
};

// Both chart datasets are computed from the `courses` prop on every render,
// so dropping a course updates the charts without any extra state.
export default function Dashboard({ courses }) {
  const pieData = buildCreditsByType(courses);
  const barData = buildWeeklyLoad(courses);

  return (
    <View>
      <Text style={styles.sectionHeader}>Academic Credit Distribution</Text>
      <PieChart
        data={pieData}
        width={SCREEN_WIDTH - 32}
        height={200}
        chartConfig={chartConfig}
        accessor="credits"
        backgroundColor="#FFFFFF"
        paddingLeft="15"
        center={[0, 0]}
        style={styles.chartStyle}
      />

      <Text style={styles.sectionHeader}>Weekly Class Load (Credit Hours / Day)</Text>
      <BarChart
        data={barData}
        width={SCREEN_WIDTH - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" ch"
        fromZero
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        style={styles.chartStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6, marginTop: 10 },
  chartStyle: { marginVertical: 8, borderRadius: 10 },
});