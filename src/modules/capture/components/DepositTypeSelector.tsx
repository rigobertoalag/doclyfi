import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type DepositType = 'received' | 'sent';

const DEPOSIT_TYPES: {
    id: DepositType;
    label: string;
    description: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    iconBg: string;
    iconColor: string;
}[] = [
    {
        id: 'received',
        label: 'Depósito que te hicieron',
        description: 'Dinero que recibiste en tu cuenta.',
        icon: 'arrow-down-circle-outline',
        iconBg: '#F0FDF4',
        iconColor: '#16A34A',
    },
    {
        id: 'sent',
        label: 'Depósito que realizaste',
        description: 'Dinero que enviaste desde tu cuenta.',
        icon: 'arrow-up-circle-outline',
        iconBg: '#EFF6FF',
        iconColor: '#3B7BFF',
    },
];

type DepositTypeSelectorProps = {
    value: DepositType | null;
    onChange: (type: DepositType) => void;
};

export function DepositTypeSelector({ value, onChange }: DepositTypeSelectorProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>¿Qué tipo de depósito es?</Text>
                <Text style={styles.subtitle}>
                    Selecciónalo para que podamos clasificarlo correctamente.
                </Text>
            </View>

            <View style={styles.optionsRow}>
                {DEPOSIT_TYPES.map((dt) => {
                    const isActive = value === dt.id;
                    return (
                        <TouchableOpacity
                            key={dt.id}
                            style={[
                                styles.option,
                                isActive && styles.optionActive,
                            ]}
                            onPress={() => onChange(dt.id)}
                            activeOpacity={0.75}
                        >
                            {/* Icon */}
                            <View style={[
                                styles.optionIcon,
                                { backgroundColor: dt.iconBg },
                                isActive && styles.optionIconActive,
                            ]}>
                                <Ionicons
                                    name={dt.icon}
                                    size={22}
                                    color={isActive ? '#FFFFFF' : dt.iconColor}
                                />
                            </View>

                            {/* Text */}
                            <Text style={[
                                styles.optionLabel,
                                isActive && styles.optionLabelActive,
                            ]}>
                                {dt.label}
                            </Text>
                            <Text style={styles.optionDesc}>{dt.description}</Text>

                            {/* Radio */}
                            <View style={[
                                styles.radio,
                                isActive && styles.radioActive,
                            ]}>
                                {isActive && <View style={styles.radioDot} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.06)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    header: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFF',
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 3,
    },
    subtitle: {
        fontSize: 11,
        color: '#94A3B8',
        lineHeight: 15,
    },
    optionsRow: {
        flexDirection: 'row',
    },
    option: {
        flex: 1,
        alignItems: 'center',
        padding: 14,
        gap: 8,
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
        position: 'relative',
    },
    optionActive: {
        backgroundColor: '#F8FAFF',
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionIconActive: {
        backgroundColor: '#16A34A',  // se sobreescribe por JS con el color del tipo
    },
    optionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        lineHeight: 16,
    },
    optionLabelActive: {
        color: '#0F172A',
    },
    optionDesc: {
        fontSize: 10,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 14,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    radioActive: {
        borderColor: '#16A34A',
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#16A34A',
    },
});
