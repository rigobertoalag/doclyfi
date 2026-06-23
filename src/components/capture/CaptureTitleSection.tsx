import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type CaptureTitleSectionProps = {
    pill: string;
    subtitle: string;
    accentColor: string;
    accentBg: string;
    accentBorder: string;
};

export function CaptureTitleSection({
    pill,
    subtitle,
    accentColor,
    accentBg,
    accentBorder,
}: CaptureTitleSectionProps) {
    return (
        <View style={styles.section}>
            <View style={[styles.pill, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                <View style={[styles.pillDot, { backgroundColor: accentColor }]} />
                <Text style={[styles.pillText, { color: accentColor }]}>{pill}</Text>
            </View>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0,0.06)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
            },
            android: { elevation: 2 },
        }),
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 10,
    },
    pillDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    pillText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 17,
    },
});