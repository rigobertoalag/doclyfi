import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Segment = {
    value: number;
    color: string;
    label: string;
};

type ReportDonutProps = {
    segments: Segment[];
    size?: number;
    strokeWidth?: number;
    centerLabel?: string;
    centerValue?: string;
    onPress?: () => void;
};

export function ReportDonut({ segments, size = 80, strokeWidth = 10, centerLabel, centerValue, onPress }: ReportDonutProps) {
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    const R = (size - strokeWidth) / 2;
    const CIRC = 2 * Math.PI * R;
    const cx = size / 2;
    const cy = size / 2;

    let offset = 0;
    const arcs = segments.map((seg) => {
        const pct = total > 0 ? seg.value / total : 0;
        const dash = CIRC * pct;
        const gap = CIRC * (1 - pct);
        const dashoffset = -offset;
        offset += dash;
        return { ...seg, dash, gap, dashoffset, pct };
    });

    const content = (
        <View style={[styles.wrap, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                <Circle cx={cx} cy={cy} r={R} stroke="#F1F5F9" strokeWidth={strokeWidth} fill="none" />
                {arcs.map((seg, i) => (
                    <Circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={R}
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${seg.dash} ${seg.gap}`}
                        strokeDashoffset={CIRC / 4 + seg.dashoffset}
                        strokeLinecap="round"
                    />
                ))}
            </Svg>
            <View style={styles.center}>
                {centerValue && <Text style={styles.centerValue}>{centerValue}</Text>}
                {centerLabel && <Text style={styles.centerLabel}>{centerLabel}</Text>}
            </View>
        </View>
    );

    if (onPress) {
        return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
    }
    return content;
}

const styles = StyleSheet.create({
    wrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0F172A',
    },
    centerLabel: {
        fontSize: 9,
        color: '#94A3B8',
        fontWeight: '500',
    },
});
