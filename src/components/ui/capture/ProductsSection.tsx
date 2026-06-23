import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type Product = {
    id: string;
    name: string;
    price: number;        // NUMERIC — sin formatear, ej: 1299.99
    quantity: number;
};

type ProductsSectionProps = {
    products: Product[];
    accentColor: string;
    onChange: (products: Product[]) => void;
};

// Cuántos productos mostrar antes de colapsar
const INITIAL_VISIBLE = 5;

export function ProductsSection({ products, accentColor, onChange }: ProductsSectionProps) {
    const [expanded, setExpanded] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const visibleProducts = expanded ? products : products.slice(0, INITIAL_VISIBLE);
    const hiddenCount = products.length - INITIAL_VISIBLE;
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((v) => !v);
    };

    const updateProduct = (id: string, field: keyof Product, raw: string) => {
        onChange(
            products.map((p) => {
                if (p.id !== id) return p;
                if (field === 'price') {
                    // Solo números y punto decimal — sin alucinaciones en el valor
                    const clean = raw.replace(/[^0-9.]/g, '');
                    return { ...p, price: parseFloat(clean) || 0 };
                }
                if (field === 'quantity') {
                    return { ...p, quantity: parseInt(raw) || 1 };
                }
                return { ...p, [field]: raw };
            }),
        );
    };

    const removeProduct = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onChange(products.filter((p) => p.id !== id));
    };

    const addProduct = () => {
        const newProduct: Product = {
            id: `prod_${Date.now()}`,
            name: '',
            price: 0,
            quantity: 1,
        };
        onChange([...products, newProduct]);
        setExpanded(true);
        setEditingId(newProduct.id);
    };

    return (
        <View style={styles.card}>
            {/* ── Header ─────────────────────────────────────────────── */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.headerIcon, { backgroundColor: accentColor + '18' }]}>
                        <Text style={styles.headerEmoji}>🛒</Text>
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Productos detectados</Text>
                        <Text style={styles.headerSub}>
                            {products.length} {products.length === 1 ? 'artículo' : 'artículos'}
                        </Text>
                    </View>
                </View>

                {/* Total chip */}
                <View style={[styles.totalChip, { backgroundColor: accentColor + '12', borderColor: accentColor + '30' }]}>
                    <Text style={[styles.totalChipText, { color: accentColor }]}>
                        {formatCurrency(total)}
                    </Text>
                </View>
            </View>

            {/* ── Column headers ─────────────────────────────────────── */}
            <View style={styles.colHeaders}>
                <Text style={[styles.colHdr, { flex: 1 }]}>Descripción</Text>
                <Text style={[styles.colHdr, styles.colQty]}>Cant.</Text>
                <Text style={[styles.colHdr, styles.colPrice]}>Precio</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* ── Product rows ───────────────────────────────────────── */}
            {visibleProducts.map((product, idx) => (
                <ProductRow
                    key={product.id}
                    product={product}
                    isLast={idx === visibleProducts.length - 1 && !expanded}
                    isEditing={editingId === product.id}
                    accentColor={accentColor}
                    onStartEdit={() => setEditingId(product.id)}
                    onEndEdit={() => setEditingId(null)}
                    onUpdate={(field, val) => updateProduct(product.id, field, val)}
                    onRemove={() => removeProduct(product.id)}
                />
            ))}

            {/* ── Expand / Collapse toggle ────────────────────────────── */}
            {products.length > INITIAL_VISIBLE && (
                <TouchableOpacity
                    style={styles.expandBtn}
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.expandText, { color: accentColor }]}>
                        {expanded
                            ? 'Ver menos'
                            : `Ver ${hiddenCount} productos más`}
                    </Text>
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={accentColor}
                    />
                </TouchableOpacity>
            )}

            {/* ── Add product ─────────────────────────────────────────── */}
            <TouchableOpacity
                style={[styles.addBtn, { borderColor: accentColor + '40' }]}
                onPress={addProduct}
                activeOpacity={0.75}
            >
                <Ionicons name="add-circle-outline" size={16} color={accentColor} />
                <Text style={[styles.addBtnText, { color: accentColor }]}>
                    Agregar producto manualmente
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── ProductRow ───────────────────────────────────────────────────────────────
type ProductRowProps = {
    product: Product;
    isLast: boolean;
    isEditing: boolean;
    accentColor: string;
    onStartEdit: () => void;
    onEndEdit: () => void;
    onUpdate: (field: keyof Product, value: string) => void;
    onRemove: () => void;
};

function ProductRow({
    product, isLast, isEditing, accentColor,
    onStartEdit, onEndEdit, onUpdate, onRemove,
}: ProductRowProps) {
    return (
        <View style={[styles.row, !isLast && styles.rowBorder]}>
            {/* Name */}
            {isEditing ? (
                <TextInput
                    style={[styles.nameInput, { flex: 1 }]}
                    value={product.name}
                    onChangeText={(v) => onUpdate('name', v)}
                    placeholder="Nombre del producto"
                    placeholderTextColor="#CBD5E1"
                    returnKeyType="next"
                    autoFocus
                />
            ) : (
                <TouchableOpacity style={{ flex: 1 }} onPress={onStartEdit} activeOpacity={0.7}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name || '—'}</Text>
                </TouchableOpacity>
            )}

            {/* Quantity */}
            {isEditing ? (
                <TextInput
                    style={[styles.qtyInput]}
                    value={String(product.quantity)}
                    onChangeText={(v) => onUpdate('quantity', v)}
                    keyboardType="numeric"
                    returnKeyType="next"
                    selectTextOnFocus
                />
            ) : (
                <TouchableOpacity onPress={onStartEdit} activeOpacity={0.7} style={styles.qtyCell}>
                    <Text style={styles.qtyText}>{product.quantity}x</Text>
                </TouchableOpacity>
            )}

            {/* Price */}
            {isEditing ? (
                <TextInput
                    style={[styles.priceInput]}
                    value={product.price === 0 ? '' : String(product.price)}
                    onChangeText={(v) => onUpdate('price', v)}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    onSubmitEditing={onEndEdit}
                    onBlur={onEndEdit}
                    selectTextOnFocus
                    placeholder="0.00"
                    placeholderTextColor="#CBD5E1"
                />
            ) : (
                <TouchableOpacity onPress={onStartEdit} activeOpacity={0.7} style={styles.priceCell}>
                    <Text style={[styles.priceText, { color: accentColor }]}>
                        {formatCurrency(product.price)}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Remove */}
            <TouchableOpacity
                style={styles.removeBtn}
                onPress={onRemove}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Ionicons name="trash-outline" size={14} color="#FDA4AF" />
            </TouchableOpacity>
        </View>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIcon: {
        width: 36, height: 36, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
    },
    headerEmoji: { fontSize: 18 },
    headerTitle: {
        fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 1,
    },
    headerSub: {
        fontSize: 11, color: '#94A3B8', fontWeight: '500',
    },
    totalChip: {
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 20, borderWidth: 1,
    },
    totalChipText: {
        fontSize: 13, fontWeight: '800', letterSpacing: -0.3,
    },

    // Column headers
    colHeaders: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        backgroundColor: '#F8FAFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        gap: 8,
    },
    colHdr: {
        fontSize: 10, fontWeight: '600', color: '#94A3B8',
        textTransform: 'uppercase', letterSpacing: 0.3,
    },
    colQty: { width: 36, textAlign: 'center' },
    colPrice: { width: 72, textAlign: 'right' },

    // Product row
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 8,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFF',
    },
    productName: {
        fontSize: 13, fontWeight: '600', color: '#1E293B', lineHeight: 17,
    },
    nameInput: {
        fontSize: 13, fontWeight: '600', color: '#1E293B',
        borderBottomWidth: 1.5, borderBottomColor: '#3B7BFF',
        paddingVertical: 2,
    },
    qtyCell: { width: 36, alignItems: 'center' },
    qtyText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    qtyInput: {
        width: 36, textAlign: 'center',
        fontSize: 12, fontWeight: '600', color: '#1E293B',
        borderBottomWidth: 1.5, borderBottomColor: '#3B7BFF',
        paddingVertical: 2,
    },
    priceCell: { width: 72, alignItems: 'flex-end' },
    priceText: { fontSize: 13, fontWeight: '700' },
    priceInput: {
        width: 72, textAlign: 'right',
        fontSize: 13, fontWeight: '700', color: '#1E293B',
        borderBottomWidth: 1.5, borderBottomColor: '#3B7BFF',
        paddingVertical: 2,
    },
    removeBtn: {
        width: 28, height: 28, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFF1F2',
    },

    // Expand
    expandBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 11,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    expandText: {
        fontSize: 12, fontWeight: '700',
    },

    // Add product
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        borderStyle: 'dashed',
    },
    addBtnText: {
        fontSize: 12, fontWeight: '600',
    },
});