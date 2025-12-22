import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function TaskItem({ item, onToggle, onRemove }) {
  const anim = useRef(new Animated.Value(item.done ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: item.done ? 1 : 0, duration: 260, useNativeDriver: true }).start();
  }, [item.done]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] });
  const bg = anim.interpolate({ inputRange: [0, 1], outputRange: ['#fff', '#eef4ff'] });

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }], backgroundColor: item.done ? '#f3f6ff' : '#fff' }]}>
      <View style={styles.left}>
        <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
          {item.done ? <AntDesign name="check" size={16} color="#fff" /> : null}
        </TouchableOpacity>
        <View style={styles.body}>
          <Text style={[styles.title, item.done && { textDecorationLine: 'line-through', color: '#9aa4c4' }]} numberOfLines={2}>
            {item.text}
          </Text>
          <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onRemove} style={styles.del}>
        <Text style={{ color: '#d03a3a', fontWeight: '700' }}>Supprimer</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderColor: '#eef2ff',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f3f6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: { flex: 1 },
  title: { fontWeight: '700' },
  meta: { color: '#9aa4c4', fontSize: 12, marginTop: 6 },
  del: { marginLeft: 12 },
});
