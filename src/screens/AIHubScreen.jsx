import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AIHubScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Hub</Text>
      <Text style={styles.subtitle}>AI-powered tools and experiments for Otakus Nexus.</Text>
      <TouchableOpacity style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>Image Generator</Text>
        <Text style={styles.cardSubtitle}>Generate anime-style images with prompts.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 16 },
  card: { padding: 16, backgroundColor: '#F7F7FC', borderRadius: 12 },
  cardTitle: { fontWeight: '700' },
  cardSubtitle: { marginTop: 6, color: '#666' },
});
