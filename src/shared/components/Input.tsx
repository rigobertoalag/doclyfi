import { Colors } from '@/shared/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
};

export const Input = forwardRef<TextInput, InputProps>(function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  style,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          hasError && styles.containerError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          style={[styles.input, leftIcon ? styles.inputWithLeft : null, style]}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={isPassword || props.keyboardType === 'email-address' ? 'none' : 'sentences'}
          autoCorrect={false}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {/* <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text> */}
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#5499E3"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  containerFocused: {
    borderColor: '#3B7BFF',
    backgroundColor: 'rgba(59, 123, 255, 0.05)',
  },
  containerError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    fontSize: 15,
    borderWidth: 0,
    color: Colors.textPrimary,
    paddingVertical: 14,
    letterSpacing: 0.2,
  },
  inputWithLeft: {
    marginLeft: 10,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
});