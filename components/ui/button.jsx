// components/ui/button.jsx
/**
 * Composant Button réutilisable avec support des thèmes et animations
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { themeManager } from '../../lib/theme/theme-manager';

export const Button = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getVariantStyles = () => {
    const colors = themeManager.getCurrentColors();
    
    switch (variant) {
      case 'primary':
        return {
          background: [colors.primary, colors.secondary],
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'secondary':
        return {
          background: [colors.surfaceVariant],
          text: colors.textPrimary,
          border: colors.border,
        };
      case 'text':
        return {
          background: ['transparent', 'transparent'],
          text: colors.primary,
          border: 'transparent',
        };
      case 'danger':
        return {
          background: ['#EF4444', '#DC2626'],
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'success':
        return {
          background: ['#10B981', '#059669'],
          text: '#FFFFFF',
          border: 'transparent',
        };
      default:
        return {
          background: [colors.primary, colors.secondary],
          text: '#FFFFFF',
          border: 'transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 16,
          iconSize: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 15,
          iconSize: 20,
        };
    }
  };

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const colors = themeManager.getCurrentColors();

  const renderContent = () => (
View style={styles.content}>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variantStyles.text}
          style={styles.loader}
        />
      ) : (
        <>
          {leftIcon && (
            <View style={[styles.icon, styles.leftIcon]}>
              {React.cloneElement(leftIcon, {
                size: sizeStyles.iconSize,
                color: variantStyles.text,
              })}
            </View>
          )}
          
Text style={[
            styles.text,
            {
              fontSize: sizeStyles.fontSize,
              color: variantStyles.text,
              opacity: disabled ? 0.6 : 1,
            },
            textStyle,
          ]}>
            {children}
          </Text>
          
          {rightIcon && (
View style={[styles.icon, styles.rightIcon]}>
              {React.cloneElement(rightIcon, {
                size: sizeStyles.iconSize,
                color: variantStyles.text,
              })}
View>
          )}
        </>
      )}
View>
  );

  const buttonStyles = [
    styles.button,
    {
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderColor: variantStyles.border,
      borderRadius: 12,
      alignSelf: fullWidth ? 'stretch' : 'center',
      opacity: disabled ? 0.6 : 1,
      transform: [{ scale: scaleAnim }],
    },
    style,
  ];

  if (variant === 'text') {
    return (
TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.7}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={buttonStyles}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
       LinearGradient
          colors={variantStyles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loader: {
    marginHorizontal: 8,
  },
});
