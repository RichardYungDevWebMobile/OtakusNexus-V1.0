import React from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 220;

export default function ParallaxHeader({ scrollY, image }) {
  const translateY = scrollY
    ? scrollY.interpolate({ inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT], outputRange: [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 1.5] })
    : 0;

  const scale = scrollY
    ? scrollY.interpolate({ inputRange: [-HEADER_HEIGHT, 0], outputRange: [2, 1], extrapolate: 'clamp' })
    : 1;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.Image
        source={{ uri: image }}
        style={[styles.image, { transform: [{ translateY }, { scale }] }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    zIndex: -1,
  },
  image: {
    width: width,
    height: HEADER_HEIGHT,
  },
});
