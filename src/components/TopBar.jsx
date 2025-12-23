import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TopBar({ title }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 64,
    paddingTop: 18,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderBottomColor: '#eef2ff',
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '800' },
});
