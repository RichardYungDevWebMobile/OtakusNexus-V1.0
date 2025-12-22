import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

export default function ChatDetailScreen({ route }) {
  const { id, name } = route.params || {};
  const [messages, setMessages] = useState([{ id: 'm1', text: 'Bienvenue sur la conversation', fromMe: false }]);
  const [text, setText] = useState('');
  const flatRef = useRef(null);

  const send = useCallback(() => {
    if (!text.trim()) return;
    const newMsg = { id: String(Date.now()), text: text.trim(), fromMe: true };
    setMessages((s) => [...s, newMsg]);
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 150);
    Keyboard.dismiss();
  }, [text]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{name || 'Conversation'}</Text>
      </View>

      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.fromMe ? styles.msgMe : styles.msgOther]}>
            <Text style={[styles.msgText, item.fromMe && { color: '#fff' }]}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Écrire un message..."
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <TouchableOpacity style={styles.send} onPress={send}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomColor: '#eef2ff', borderBottomWidth: 1 },
  title: { fontWeight: '800' },
  msg: { marginVertical: 6, padding: 10, borderRadius: 10, maxWidth: '80%' },
  msgMe: { backgroundColor: '#5B7CFA', alignSelf: 'flex-end' },
  msgOther: { backgroundColor: '#f3f6ff', alignSelf: 'flex-start' },
  msgText: { color: '#0b1220' },
  inputRow: { flexDirection: 'row', padding: 8, borderTopColor: '#eef2ff', borderTopWidth: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0, bottom: 0 },
  input: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8, borderColor: '#eef2ff', borderWidth: 1, marginLeft: 8, marginRight: 8 },
  send: { backgroundColor: '#5B7CFA', padding: 12, borderRadius: 8, marginRight: 8 },
});
