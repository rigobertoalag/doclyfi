import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

type NewDocumentCardProps = {
    onPress?: () => void;
};

export function NewDocumentCard({ onPress }: NewDocumentCardProps) {
    return (
        <TouchableOpacity
            style={[styles.catCard, styles.newDocCard]}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <View style={styles.newPlusCircle}>
                <Text style={styles.newPlus}>+</Text>
            </View>
            <Text style={styles.newLabel}>Nuevo{'\n'}Documento</Text>
        </TouchableOpacity>
    );
}
