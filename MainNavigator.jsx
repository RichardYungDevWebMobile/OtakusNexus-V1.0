import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WatchlistScreen from './WatchlistScreen';
import AnimeDetailScreen from './AnimeDetailScreen';
import AnimatedTabBar from './components/AnimatedTabBar';
import LoginScreen from './Auth/LoginScreen';
import RegisterScreen from './Auth/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <AnimatedTabBar {...props} />}>
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      {/* Placeholder for other tabs (Search, Browse, Profile) */}
      <Tab.Screen name="AnimeDetail" component={AnimeDetailScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth flow can be added/guarded here (this is a simple stub) */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AnimeDetailModal" component={AnimeDetailScreen} />
    </Stack.Navigator>
  );
}
