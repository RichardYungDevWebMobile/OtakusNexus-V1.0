import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function NewsCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta}>{item.source} · {item.publishedAt}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginVertical: 8, borderWidth: 1, borderColor: '#eef2ff' },
  image: { width: 110, height: 84, backgroundColor: '#f3f6ff' },
  content: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { fontWeight: '800', color: '#0b1220' },
  meta: { color: '#6b7280', marginTop: 6, fontSize: 12 },
});
