import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function AIHubScreen() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const send = async () => {
    if (!text.trim()) return;
    setMessages((s) => [...s, { id: String(Date.now()), from: 'user', text: text.trim() }]);
    setText('');
    // placeholder AI reply (simulate latency)
    setTimeout(
      () =>
        setMessages((s) => [
          ...s,
          { id: String(Date.now() + 1), from: 'ai', text: 'Réponse du Nexus Chatbot (exemple).' },
        ]),
      600
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Nexus Chatbot</Text>

      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.from === 'ai' ? styles.ai : styles.user]}>
            <Text style={item.from === 'ai' ? {} : { color: '#fff' }}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
      />

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Demande au chatbot..."
          value={text}
          onChangeText={setText}
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <TouchableOpacity style={styles.send} onPress={send}>
          <Text style={{ color: '#fff' }}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  h1: { fontSize: 18, fontWeight: '800', padding: 16 },
  msg: { padding: 12, borderRadius: 10, marginVertical: 6, maxWidth: '80%' },
  ai: { backgroundColor: '#f3f6ff', alignSelf: 'flex-start' },
  user: { backgroundColor: '#5B7CFA', alignSelf: 'flex-end' },
  row: { flexDirection: 'row', padding: 8, borderTopColor: '#eef2ff', borderTopWidth: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0, bottom: 0 },
  input: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eef2ff', marginLeft: 8, marginRight: 8 },
  send: { backgroundColor: '#5B7CFA', padding: 12, borderRadius: 8, marginRight: 8 },
});
