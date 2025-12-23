import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MOCK = [
  { id: '1', name: 'Aki', last: 'Salut !' },
  { id: '2', name: 'Luna', last: 'New fanart' },
];

export default function ChatListScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => nav.navigate('ChatDetail', { id: item.id, name: item.name })}
          >
            <View style={styles.avatar} />
            <View style={styles.body}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.last}>{item.last}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: { flexDirection: 'row', padding: 14, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3f6ff' },
  body: { marginLeft: 12, justifyContent: 'center' },
  name: { fontWeight: '700' },
  last: { color: '#6b7280', marginTop: 4 },
  sep: { height: 1, backgroundColor: '#eef2ff', marginLeft: 74 },
});
