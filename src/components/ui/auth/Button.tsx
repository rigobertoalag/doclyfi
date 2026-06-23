import { Colors } from '@/constants/colors';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type TouchableOpacityProps,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = TouchableOpacityProps & {
    label: string;
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
};

const variantStyles: Record<Variant, object> = {
    primary: {
        backgroundColor: Colors.primary,
        borderWidth: 0,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    danger: {
        backgroundColor: Colors.error,
        borderWidth: 0,
    },
};

const variantTextStyles: Record<Variant, object> = {
    primary: { color: '#FFFFFF' },
    secondary: { color: Colors.primaryLight },
    ghost: { color: Colors.textSecondary },
    danger: { color: '#FFFFFF' },
};

const sizeStyles: Record<Size, object> = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16 },
};

const sizeTextStyles: Record<Size, object> = {
    sm: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
    md: { fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
    lg: { fontSize: 17, fontWeight: '700', letterSpacing: 0.4 },
};

export function Button({
    label,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    style,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            disabled={isDisabled}
            style={[
                styles.base,
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'secondary' || variant === 'ghost' ? Colors.primary : '#FFF'}
                />
            ) : (
                <View style={styles.content}>
                    {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                    <Text style={[styles.label, variantTextStyles[variant], sizeTextStyles[size]]}>
                        {label}
                    </Text>
                    {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.45,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        textAlign: 'center',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});