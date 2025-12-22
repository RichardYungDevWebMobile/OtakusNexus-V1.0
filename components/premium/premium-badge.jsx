// components/premium/premium-badge.jsx
/**
 * Badge premium réutilisable
 * Indique visuellement les fonctionnalités premium
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const PremiumBadge = ({ 
  size = 'medium', 
  variant = 'default',
  label = 'PREMIUM',
  showIcon = true 
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 10 };
      case 'large':
        return { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 };
      default:
        return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          colors: ['#FFD700', '#FFA500'],
          iconColor: '#FFFFFF',
          textColor: '#FFFFFF',
        };
      case 'purple':
        return {
          colors: ['#9D4EDD', '#7B2CBF'],
          iconColor: '#FFFFFF',
          textColor: '#FFFFFF',
        };
      case 'minimal':
        return {
          colors: ['#5B7CFA', '#7D9AFC'],
          iconColor: '#FFFFFF',
          textColor: '#FFFFFF',
        };
      default:
        return {
          colors: ['#5B7CFA', '#7D9AFC'],
          iconColor: '#FFFFFF',
          textColor: '#FFFFFF',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
LinearGradient
      colors={variantStyles.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.paddingVertical * 2,
        }
      ]}
    >
      {showIcon && (
Ionicons 
          name="sparkles" 
          size={sizeStyles.fontSize} 
          color={variantStyles.iconColor}
          style={styles.icon}
        />
      )}
Text style={[
        styles.text,
        { 
          fontSize: sizeStyles.fontSize,
          color: variantStyles.textColor,
        }
      ]}>
        {label}
Text>
LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 1,
  },
});
