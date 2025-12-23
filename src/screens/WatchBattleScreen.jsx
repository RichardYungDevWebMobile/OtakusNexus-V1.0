import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function WatchBattleScreen() {
  const [leftScore, setLeft] = useState(0);
  const [rightScore, setRight] = useState(0);
  const scaleLeft = new Animated.Value(1);
  const scaleRight = new Animated.Value(1);

  const bump = (anim) => {
    Animated.sequence([Animated.timing(anim, { toValue: 1.08, duration: 140, useNativeDriver: true }), Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true })]).start();
  };

  const voteLeft = () => {
    setLeft((s) => s + 1);
    bump(scaleLeft);
  };
  const voteRight = () => {
    setRight((s) => s + 1);
    bump(scaleRight);
  };

  const total = leftScore + rightScore || 1;
  const leftPct = Math.round((leftScore / total) * 100);
  const rightPct = Math.round((rightScore / total) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watch Battle</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={voteLeft}>
          <Text style={styles.cardTitle}>Show A</Text>
          <Text style={styles.pct}>{leftPct}%</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={voteRight}>
          <Text style={styles.cardTitle}>Show B</Text>
          <Text style={styles.pct}>{rightPct}%</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.meta}>
        <Text style={{ color: '#6b7280' }}>Votes: {leftScore + rightScore}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '900', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { width: '48%', height: 180, borderRadius: 12, backgroundColor: '#f3f6ff', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontWeight: '800' },
  pct: { marginTop: 8, color: '#6b7280', fontWeight: '800' },
  meta: { marginTop: 18 },
});
