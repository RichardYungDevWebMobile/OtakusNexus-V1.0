import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Nadva</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Niveau</Text>
        <Text style={styles.value}>12</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Badges</Text>
        <Text style={styles.value}>12</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AIHub')}>
        <Text style={styles.buttonText}>Ouvrir Nexus Chatbot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#f3f6ff' },
  name: { marginLeft: 12, fontSize: 18, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomColor: '#eef2ff', borderBottomWidth: 1 },
  label: { color: '#6b7280' },
  value: { fontWeight: '700' },
  button: { marginTop: 24, backgroundColor: '#5B7CFA', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
