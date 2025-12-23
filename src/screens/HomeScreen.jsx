import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../components/TopBar';

export default function HomeScreen() {
  const nav = useNavigation();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 480, useNativeDriver: true }).start();
  }, [fade]);

  const translateY = fade.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  return (
    <View style={styles.container}>
      <TopBar title="Otakus Nexus" />
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.hero, { opacity: fade, transform: [{ translateY }] }]}>
          <Text style={styles.title}>Bienvenue sur Nexus</Text>
          <Text style={styles.subtitle}>Découvre, suis et partage tes animés préférés.</Text>
        </Animated.View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.action} onPress={() => nav.navigate('AIHub')}>
            <Text style={styles.actionText}>Nexus Chatbot</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => nav.navigate('ChatList')}>
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => nav.navigate('Profile')}>
            <Text style={styles.actionText}>Profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actualités</Text>
          <TouchableOpacity style={styles.card} onPress={() => nav.navigate('AnimeDetail')}>
            <Text style={styles.cardTitle}>Titre article important</Text>
            <Text style={styles.cardMeta}>Source · 2h</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 32 },
  hero: { marginBottom: 18 },
  title: { fontSize: 22, fontWeight: '800', color: '#0b1220' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 6 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  action: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#f6f9ff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: { color: '#0b1220', fontWeight: '700' },
  section: { marginTop: 12 },
  sectionTitle: { fontWeight: '700', marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    elevation: 1,
  },
  cardTitle: { fontWeight: '700' },
  cardMeta: { color: '#6b7280', marginTop: 6 },
});
