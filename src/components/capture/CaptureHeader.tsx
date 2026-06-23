import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CaptureHeaderProps = {
    onBack: () => void;
};

export function CaptureHeader({ onBack }: CaptureHeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backBtn}
                onPress={onBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
                    size={Platform.OS === 'ios' ? 20 : 22}
                    color="#475569"
                />
                {Platform.OS === 'ios' && (
                    <Text style={styles.backLabel}>Volver</Text>
                )}
            </TouchableOpacity>

            <View style={styles.logoWrap} pointerEvents="none">
                <Image
                    source={require('@/assets/doclyfi_images/logo_no_background.png')}
                    style={styles.logo}
                    contentFit="contain"
                />
            </View>

            <View style={styles.spacer} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F8FAFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E2E4',
        position: 'relative',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        paddingVertical: 4,
        paddingHorizontal: Platform.OS === 'ios' ? 0 : 6,
        borderRadius: Platform.OS === 'ios' ? 0 : 8,
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#F8FAFF',
        borderWidth: Platform.OS === 'ios' ? 0 : 1,
        borderColor: Platform.OS === 'ios' ? 'transparent' : '#F8FAFF',
        minWidth: 70,
    },
    backLabel: {
        fontSize: 16,
        color: '#475569',
        fontWeight: '400',
    },
    logoWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: 45,
        width: 110,
    },
    spacer: {
        minWidth: 70,
    },
});