import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function NewsDetailScreen({ route }) {
  const { item } = route.params || {};
  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Article introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image source={{ uri: item.image }} style={styles.hero} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.source} · {item.publishedAt}</Text>
        <Text style={styles.body}>{item.body || 'Contenu de l\'article — placeholder...'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: 200, backgroundColor: '#f3f6ff' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  meta: { color: '#6b7280', marginTop: 8 },
  body: { marginTop: 12, color: '#0b1220', lineHeight: 20 },
});
