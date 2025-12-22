// components/ui/input.jsx

/**
 * Composant Input réutilisable avec validation et thèmes
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeManager } from '../../lib/theme/theme-manager';

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error = null,
  success = false,
  disabled = false,
  leftIcon,
  rightIcon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  onSubmitEditing,
  returnKeyType = 'done',
  blurOnSubmit = true,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const colors = themeManager.getCurrentColors();

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? colors.error : (success ? colors.success : colors.border),
      error ? colors.error : (success ? colors.success : colors.primary),
    ],
  });

  const backgroundColor = disabled 
    ? colors.surfaceVariant + '80'
    : colors.surfaceVariant;

  return (
    <View style={[styles.container, style]}>
      {label && (
Text style={[
          styles.label,
          { color: colors.textSecondary },
          labelStyle,
        ]}>
          {label}
        </Text>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor,
            borderWidth: 1,
            borderRadius: 12,
          },
          multiline && { minHeight: numberOfLines * 24 },
        ]}
      >
        {leftIcon && (
View style={[styles.icon, styles.leftIcon]}>
            {React.cloneElement(leftIcon, {
              size: 20,
              color: isFocused ? colors.primary : colors.textSecondary,
            })}
          </View>
        )}

TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              paddingLeft: leftIcon ? 44 : 16,
              paddingRight: secureTextEntry || rightIcon ? 44 : 16,
              height: multiline ? undefined : 48,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary + '80'}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={[styles.icon, styles.rightIcon]}
            onPress={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {!secureTextEntry && rightIcon && (
View style={[styles.icon, styles.rightIcon]}>
            {React.cloneElement(rightIcon, {
              size: 20,
              color: isFocused ? colors.primary : colors.textSecondary,
            })}
          </View>
        )}

        {success && (
          <View style={[styles.icon, styles.rightIcon]}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.success}
            />
          </View>
        )}
      </Animated.View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle"
            size={16}
            color={colors.error}
            style={styles.errorIcon}
          />
          <Text style={[
            styles.errorText,
            { color: colors.error },
            errorStyle,
          ]}>
            {error}
          </Text>
        </View>
      )}

      {maxLength && (
Text style={[
          styles.counter,
          { color: colors.textSecondary },
        ]}>
          {value?.length || 0}/{maxLength}
Text>
      )}
View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  icon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
  },
  leftIcon: {
    left: 0,
  },
  rightIcon: {
    right: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorIcon: {
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
  },
  counter: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});
