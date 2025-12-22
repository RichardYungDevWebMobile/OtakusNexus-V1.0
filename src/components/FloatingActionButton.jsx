import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

export default function FloatingActionButton({ onPress, label = '+' }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.fab}>
      <View style={styles.inner}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 26,
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  inner: {
    flex: 1,
    backgroundColor: '#5B7CFA',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontSize: 28, fontWeight: '800' },
});
