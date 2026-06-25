import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CaptureInfoStripProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    text: string;
    color: string;
    bg: string;
    border: string;
};

export function CaptureInfoStrip({ icon, text, color, bg, border }: CaptureInfoStripProps) {
    return (
        <View style={[styles.strip, { backgroundColor: bg, borderColor: border }]}>
            <Ionicons name={icon} size={16} color={color} style={{ marginTop: 1 }} />
            <Text style={[styles.text, { color }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    strip: {
        flexDirection: 'row', alignItems: 'flex-start',
        gap: 8, borderRadius: 12, borderWidth: 1, padding: 12,
    },
    text: { flex: 1, fontSize: 11, fontWeight: '500', lineHeight: 16 },
});