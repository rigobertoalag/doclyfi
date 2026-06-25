import { router } from '@/shared/lib/routes';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES } from './data';
import { styles } from './styles';
import { CategoryCard } from './CategoryCard';
import { NewDocumentCard } from './NewDocumentCard';

type CategoryGridProps = {
    onNewDocument?: () => void;
};

export function CategoryGrid({ onNewDocument }: CategoryGridProps) {
    const items = [...CATEGORIES, null];
    const rows = [items.slice(0, 3), items.slice(3, 6)];

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Categorías</Text>
                <TouchableOpacity onPress={() => router.push('/(main)/dashboard')}>
                    <Text style={styles.link}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            {rows.map((row, rowIdx) => (
                <View
                    key={rowIdx}
                    style={[styles.row, rowIdx < rows.length - 1 && styles.rowGap]}
                >
                    {row.map((cat, colIdx) =>
                        cat === null ? (
                            <NewDocumentCard key="new" onPress={onNewDocument} />
                        ) : (
                            <CategoryCard
                                key={cat.id}
                                category={cat}
                                onPress={() => router.push(cat.route as any)}
                            />
                        ),
                    )}
                </View>
            ))}
        </View>
    );
}
