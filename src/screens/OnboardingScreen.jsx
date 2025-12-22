import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';

export default function OnboardingScreen({ navigation }) {
  const handleStart = () => navigation.replace('Home');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Otakus Nexus</Text>
      <Text style={styles.subtitle}>Discover anime, chat with friends, and explore AI tools.</Text>
      <Button title="Get Started" onPress={handleStart} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
