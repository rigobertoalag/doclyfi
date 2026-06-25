import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import { formatCurrency } from './helpers';
import { styles } from './styles';

type MetricColumnProps = {
    label:      string;
    value:      number | null;
    trend:      number | null;
    color:      string;
    sparkPath:  string;
    gradientId: string;
    missingCta?: { label: string; route: string };
};

export function MetricColumn({
    label, value, trend, color, sparkPath, gradientId, missingCta,
}: MetricColumnProps) {
    const hasData = value !== null;

    if (!hasData) {
        return (
            <View style={[styles.metric, styles.metricEmpty]}>
                <Text style={styles.metricLabel}>{label}</Text>

                <View style={styles.emptyValueRow}>
                    <Text style={styles.emptyValueText}>$—</Text>
                    <Svg width={52} height={28} viewBox="0 0 52 28">
                        <Path
                            d="M2 14 L50 14"
                            stroke="#E2E8F0"
                            strokeWidth={1.5}
                            strokeDasharray="4 3"
                            strokeLinecap="round"
                        />
                    </Svg>
                </View>

                {missingCta && (
                    <TouchableOpacity
                        style={styles.missingCta}
                        onPress={() => router.push(missingCta.route as any)}
                        activeOpacity={0.75}
                    >
                        <Ionicons name="add" size={11} color="#3B7BFF" />
                        <Text style={styles.missingCtaText}>{missingCta.label}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    const isUp       = (trend ?? 0) >= 0;
    const trendColor  = isUp ? '#16A34A' : '#DC2626';
    const trendBg     = isUp ? '#F0FDF4' : '#FEF2F2';
    const trendBorder = isUp ? '#BBF7D0' : '#FECACA';

    return (
        <View style={styles.metric}>
            <Text style={styles.metricLabel}>{label}</Text>

            <View style={styles.metricValueRow}>
                <Text style={[styles.metricValue, { color }]}>
                    {formatCurrency(value)}
                </Text>

                <Svg width={52} height={28} viewBox="0 0 52 28">
                    <Defs>
                        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0%" stopColor={color} stopOpacity={0.18} />
                            <Stop offset="100%" stopColor={color} stopOpacity={0} />
                        </LinearGradient>
                    </Defs>
                    <Path
                        d={sparkPath}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <Path
                        d={`${sparkPath} L50 28 L2 28 Z`}
                        fill={`url(#${gradientId})`}
                    />
                </Svg>
            </View>

            {trend !== null ? (
                <View style={[styles.trendBadge, { backgroundColor: trendBg, borderColor: trendBorder }]}>
                    <Text style={[styles.trendText, { color: trendColor }]}>
                        {isUp ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                    </Text>
                </View>
            ) : (
                <View style={styles.trendNeutral}>
                    <Text style={styles.trendNeutralText}>Sin comparativa</Text>
                </View>
            )}
        </View>
    );
}
