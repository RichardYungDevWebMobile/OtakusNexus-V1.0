import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function ChatDetailScreen({ route }) {
  const { id, name } = route.params || {};
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', fromMe: false },
    { id: '2', text: 'Hi there!', fromMe: true },
  ]);
  const [text, setText] = useState('');

  useEffect(() => {
    // placeholder for loading messages by id
  }, [id]);

  const send = () => {
    if (!text.trim()) return;
    const next = { id: String(Date.now()), text: text.trim(), fromMe: true };
    setMessages((m) => [...m, next]);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name || 'Chat'}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.fromMe ? styles.me : styles.them]}>
            <Text style={{ color: item.fromMe ? '#fff' : '#111' }}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <TouchableOpacity onPress={send} style={styles.sendButton}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, fontSize: 18, fontWeight: '700', borderBottomWidth: 1, borderBottomColor: '#eee' },
  bubble: { padding: 10, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
  me: { backgroundColor: '#6C5CE7', alignSelf: 'flex-end' },
  them: { backgroundColor: '#F1F1F1', alignSelf: 'flex-start' },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#F7F7FC', marginRight: 8 },
  sendButton: { backgroundColor: '#6C5CE7', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, justifyContent: 'center' },
});
