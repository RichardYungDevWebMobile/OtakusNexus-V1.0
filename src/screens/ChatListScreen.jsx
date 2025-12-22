import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const mockConvos = Array.from({ length: 8 }).map((_, i) => ({ id: String(i), name: `User ${i + 1}`, last: 'Hey, let\'s watch that anime!' }));

export default function ChatListScreen({ navigation }) {
  const openChat = (item) => navigation.navigate('ChatDetail', { id: item.id, name: item.name });

  return (
    <View style={styles.container}>
      <FlatList
        data={mockConvos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => openChat(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.last}>{item.last}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontWeight: '700' },
  last: { marginTop: 4, color: '#666' },
});
