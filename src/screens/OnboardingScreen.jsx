import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Otakus Nexus</Text>
      <Text style={styles.h1}>Centralise ton univers anime & manga</Text>
      <Text style={styles.p}>Suivre les nouveautés, discuter et personnaliser ton expérience.</Text>
      <TouchableOpacity style={styles.cta} onPress={() => nav.replace('Home')}>
        <Text style={styles.ctaText}>Commencer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => nav.navigate('Login')}>
        <Text style={styles.linkText}>Déjà un compte ? Connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logo: { fontSize: 28, fontWeight: '900', color: '#5B7CFA', marginBottom: 10 },
  h1: { fontSize: 18, fontWeight: '800', color: '#0b1220', textAlign: 'center' },
  p: { color: '#6b7280', textAlign: 'center', marginTop: 8 },
  cta: { marginTop: 28, backgroundColor: '#5B7CFA', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 12 },
  ctaText: { color: '#fff', fontWeight: '700' },
  link: { marginTop: 12 },
  linkText: { color: '#6b7280' },
});

