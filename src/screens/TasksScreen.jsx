import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Animated,
  Platform,
  UIManager,
} from 'react-native';
import TaskItem from '../components/TaskItem';
import FloatingActionButton from '../components/FloatingActionButton';
import useLocalTasks from '../hooks/useLocalTasks';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TasksScreen() {
  const { tasks, add, toggle, remove } = useLocalTasks();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [fade]);

  const onAdd = async () => {
    const t = value.trim();
    if (!t) return;
    await add(t);
    setValue('');
    Keyboard.dismiss();
    inputRef.current?.blur();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fade }]}>
        <Text style={styles.h1}>Mes tâches</Text>
        <Text style={styles.h2}>Local, rapide et offline</Text>
      </Animated.View>

      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          placeholder="Nouvelle tâche..."
          value={value}
          onChangeText={setValue}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={onAdd}
        />
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={() => toggle(item.id)}
            onRemove={() => remove(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune tâche — ajoute la première ✨</Text>
          </View>
        )}
      />

      <FloatingActionButton onPress={() => inputRef.current?.focus()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomColor: '#eef2ff', borderBottomWidth: 1 },
  h1: { fontSize: 20, fontWeight: '800', color: '#0b1220' },
  h2: { color: '#6b7280', marginTop: 6 },
  inputRow: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eef2ff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  addBtn: { marginLeft: 8, backgroundColor: '#5B7CFA', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  addText: { color: '#fff', fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 48 },
  emptyText: { color: '#6b7280' },
});
