import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ProfileAvatarProps = {
    uri: string | null;
    name: string;
    size?: number;
    onEdit?: () => void;
};

export function ProfileAvatar({ uri, name, size = 76, onEdit }: ProfileAvatarProps) {
    const initial = name?.trim().charAt(0).toUpperCase() ?? '?';
    const borderRadius = Math.round(size * 0.34);

    return (
        <TouchableOpacity onPress={onEdit} disabled={!onEdit} activeOpacity={onEdit ? 0.7 : 1}>
            <View style={[styles.container, { width: size, height: size, borderRadius }]}>
                {uri ? (
                    <Image source={{ uri }} style={[styles.image, { borderRadius }]} contentFit="cover" />
                ) : (
                    <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
                )}
            </View>
            {onEdit && (
                <View style={[styles.badge, { top: size - 10, left: size - 14 }]}>
                    <Ionicons name="camera" size={12} color="#FFFFFF" />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3B7BFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#BFDBFE',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    initial: {
        fontWeight: '800',
        color: '#FFFFFF',
    },
    badge: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#3B7BFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.4)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 4,
            },
            android: { elevation: 3 },
        }),
    },
});
