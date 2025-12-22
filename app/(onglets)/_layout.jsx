
/**
 * Layout des onglets principaux
 * Gère la navigation par onglets avec animations et badges
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { themeManager } from '../../lib/theme/theme-manager';
import { useAnalytics } from '../../lib/hooks/use-analytics';
import { PremiumBadge } from '../../components/premium/premium-badge';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { trackEvent } = useAnalytics();
  const colors = themeManager.getCurrentColors();

  const handleTabPress = (tabName) => {
    trackEvent('tab_switch', { tab_name: tabName });
  };

  return (
Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Onglet Nexus (Home) */}
      <Tabs.Screen
        name="nexus"
        options={{
          title: 'Nexus',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('nexus'),
        }}
      />

      {/* Onglet Communautés */}
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communautés',
          tabBarIcon: ({ focused, color, size }) => (
Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('communities'),
        }}
      />

      {/* Onglet Waifu Battle */}
Tabs.Screen
        name="waifu"
        options={{
          title: 'Waifu Battle',
          tabBarIcon: ({ focused, color, size }) => (
FontAwesome5
              name="fist-raised"
              size={size - 2}
              color={color}
            />
          ),
          tabBarBadge: 3, // Exemple de badge
          tabBarBadgeStyle: {
            backgroundColor: colors.error,
            color: '#FFFFFF',
            fontSize: 10,
            minWidth: 18,
            height: 18,
          },
        }}
        listeners={{
          tabPress: () => handleTabPress('waifu_battle'),
        }}
      />

      {/* Onglet IA */}
      <Tabs.Screen
        name="ai"
        options={{
          title: 'IA',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('ai'),
        }}
      />

      {/* Onglet Profil */}
Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused, color, size }) => (
Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('profile'),
        }}
      />
    </Tabs>
  );
         }
