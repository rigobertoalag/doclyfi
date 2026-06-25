import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    LayoutAnimation, Platform, StyleSheet,
    Text, TouchableOpacity, UIManager, View,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type AlertConfig = {
    selectedDays: number | null;  // ✅ un solo valor, no array
    customDate: Date | null;
};

type ExpiryAlertsProps = {
    value: AlertConfig;
    onChange: (config: AlertConfig) => void;
    accentColor?: string;
};

const PRESETS = [
    { days: 30, label: '30 días' },
    { days: 15, label: '15 días' },
    { days: 7, label: '7 días' },
    { days: 1, label: '1 día' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ExpiryAlerts({
    value,
    onChange,
    accentColor = '#3B7BFF',
}: ExpiryAlertsProps) {
    const [showCustom, setShowCustom] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const accentBg = `${accentColor}12`;
    const accentBorder = `${accentColor}35`;

    const clearCustomDate = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onChange({ ...value, customDate: null });
        setShowCustom(false);
    };

    const toggleCustom = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (showCustom && value.customDate) {
            clearCustomDate();
        } else {
            setShowCustom(v => !v);
        }
    };

    // ── Summary — simplificado para un solo valor ─────────────────────────────────
    const summaryText = value.customDate
        ? value.customDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
        : value.selectedDays
            ? `${value.selectedDays} día${value.selectedDays !== 1 ? 's' : ''}`
            : null;

    const hasAlert = !!summaryText;

    // ── Selección de preset — ahora radio, no toggle ──────────────────────────────
    const selectPreset = (days: number) => {
        onChange({
            selectedDays: value.selectedDays === days ? null : days, // deselecciona si ya está activo
            customDate: null,   // ✅ limpiar fecha personalizada al elegir preset
        });
        // Cerrar el picker personalizado si estaba abierto
        setShowCustom(false);
    };

    // ── Custom date — limpiar preset al elegir fecha ──────────────────────────────
    const handleDateChange = (_: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            onChange({
                selectedDays: null,   // ✅ limpiar preset al elegir fecha personalizada
                customDate: date,
            });
        }
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Alertas de vencimiento</Text>
                    <Text style={styles.subtitle}>Elige cuándo quieres recibir recordatorios</Text>
                </View>
                <TouchableOpacity style={styles.infoBtn}>
                    <Ionicons name="information-circle-outline" size={18} color={accentColor} />
                </TouchableOpacity>
            </View>

            {/* Preset chips */}
            <View style={styles.chipsRow}>
                {PRESETS.map(({ days, label }) => {
                    const active = value.selectedDays === days;  // ✅ comparación simple
                    return (
                        <TouchableOpacity
                            key={days}
                            style={[
                                styles.chip,
                                active && { backgroundColor: accentBg, borderColor: accentColor },
                            ]}
                            onPress={() => selectPreset(days)}   // ✅ selectPreset, no togglePreset
                            activeOpacity={0.75}
                        >
                            {active && (
                                // ✅ Radio circle en lugar de checkmark — más claro visualmente
                                <View style={[styles.chipRadio, { borderColor: accentColor }]}>
                                    <View style={[styles.chipRadioDot, { backgroundColor: accentColor }]} />
                                </View>
                            )}
                            <Text style={[styles.chipLabel, active && { color: accentColor }]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Custom button */}
            <TouchableOpacity
                style={[
                    styles.customBtn,
                    (showCustom || value.customDate) && {
                        borderStyle: 'solid',
                        backgroundColor: accentBg,
                        borderColor: accentColor,
                    },
                ]}
                onPress={toggleCustom}
                activeOpacity={0.75}
            >
                <Ionicons
                    name={showCustom && value.customDate ? 'close-circle-outline' : 'add'}
                    size={15}
                    color={accentColor}
                />
                <Text style={[styles.customBtnText, { color: accentColor }]}>
                    {value.customDate
                        ? value.customDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
                        : 'Personalizado'}
                </Text>
            </TouchableOpacity>

            {/* Date picker expanded */}
            {showCustom && !value.customDate && (
                <View style={styles.datePickerWrap}>
                    <Text style={styles.datePickerLabel}>Selecciona una fecha específica</Text>

                    <TouchableOpacity
                        style={[styles.datePickerTrigger, { borderColor: accentBorder }]}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="calendar-outline" size={16} color={accentColor} />
                        <Text style={[styles.datePickerTriggerText, { color: accentColor }]}>
                            Elegir fecha
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={value.customDate ?? new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            minimumDate={new Date()}
                            onChange={handleDateChange}
                            locale="es-MX"
                        />
                    )}
                </View>
            )}

            {/* Summary */}
            {hasAlert && (
                <View style={[styles.summary, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                    <Ionicons name="notifications-outline" size={14} color={accentColor} />
                    <Text style={[styles.summaryText, { color: accentColor }]}>
                        Recibirás una alerta {summaryText} antes del vencimiento
                    </Text>
                </View>
            )}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 14,
        gap: 12,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
        letterSpacing: -0.2,
    },
    subtitle: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '400',
    },
    infoBtn: {
        padding: 2,
        flexShrink: 0,
    },

    // Chips
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFF',
    },
    chipLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    chipCheck: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipRadio: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipRadioDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },

    // Custom button
    customBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        borderStyle: 'dashed',
        backgroundColor: '#F8FAFF',
        alignSelf: 'flex-start',
    },
    customBtnText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Date picker
    datePickerWrap: {
        gap: 8,
    },
    datePickerLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    datePickerTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 42,
        paddingHorizontal: 14,
        borderRadius: 11,
        borderWidth: 1.5,
        backgroundColor: '#F8FAFF',
    },
    datePickerTriggerText: {
        fontSize: 13,
        fontWeight: '600',
    },

    // Summary
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 11,
        paddingVertical: 8,
    },
    summaryText: {
        flex: 1,
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 15,
    },
});