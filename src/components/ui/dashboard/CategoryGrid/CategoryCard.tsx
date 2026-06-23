import { Image } from 'expo-image';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import type { Category } from './data';
import { styles } from './styles';

type CategoryCardProps = {
    category: Category;
    onPress: () => void;
};

export function CategoryCard({ category: cat, onPress }: CategoryCardProps) {
    return (
        <TouchableOpacity
            style={styles.catCard}
            onPress={onPress}
            activeOpacity={0.75}
        >
            <View
                style={[
                    styles.iconBox,
                    { backgroundColor: cat.bg, borderColor: cat.border },
                    Platform.OS === 'ios' && { shadowColor: cat.shadow },
                ]}
            >
                <Image source={cat.image} style={styles.catImage} />
            </View>

            <Text style={styles.catName}>{cat.label}</Text>
        </TouchableOpacity>
    );
}
