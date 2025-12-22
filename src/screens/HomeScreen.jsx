import React, { useRef } from 'react';
import { View, Text, FlatList, Animated, StyleSheet } from 'react-native';
import FeedCard from '../components/FeedCard';
import ParallaxHeader from '../components/ParallaxHeader';

const mockData = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  title: `Post #${i + 1}`,
  subtitle: 'A short description about this post.',
  image: 'https://placekitten.com/800/400',
}));

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <ParallaxHeader scrollY={scrollY} image="https://placekitten.com/1200/600" />
      <Animated.FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 220, paddingHorizontal: 12, paddingBottom: 24 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item }) => (
          <FeedCard title={item.title} subtitle={item.subtitle} image={item.image} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FC',
  },
});
