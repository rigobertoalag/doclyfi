import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ProfileSectionCardProps = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color?: string;
    defaultExpanded?: boolean;
    children: React.ReactNode;
};

export function ProfileSectionCard({ title, icon, color = '#3B7BFF', defaultExpanded = false, children }: ProfileSectionCardProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((v) => !v);
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.7}>
                <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
                    <Ionicons name={icon} size={18} color={color} />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#CBD5E1"
                />
            </TouchableOpacity>
            {expanded && <View style={styles.content}>{children}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.06)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 14,
            },
            android: { elevation: 2 },
        }),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    content: {
        paddingHorizontal: 14,
        paddingBottom: 14,
    },
});
