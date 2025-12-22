import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

// Very small stub of an animated tab bar. Replace animations with Reanimated or Animated API.
export default function AnimatedTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', height: 56, borderTopWidth: 1, borderColor: '#eee' }}>
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const label = descriptor.options.tabBarLabel ?? descriptor.options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: isFocused ? '#6200ee' : '#222' }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
