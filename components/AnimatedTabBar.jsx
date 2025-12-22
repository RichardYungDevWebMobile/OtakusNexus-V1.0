import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] || {};
        const label = options?.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrapper, isFocused && styles.activeIcon]}>
              <Text style={[styles.iconText, isFocused && styles.activeText]}>
                {String(label).charAt(0)}
              </Text>
            </View>
            <Text style={[styles.label, isFocused && styles.activeText]} numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopColor: '#eef2ff',
    borderTopWidth: 1,
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: { alignItems: 'center', width: 90 },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  activeIcon: { backgroundColor: '#5B7CFA' },
  iconText: { color: '#6b7280', fontWeight: '700' },
  activeText: { color: '#fff' },
  label: { fontSize: 11, color: '#6b7280' },
});
