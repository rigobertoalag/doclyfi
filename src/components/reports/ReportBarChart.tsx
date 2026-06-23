import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

type Bar = {
    label: string;
    value: number;
    color: string;
};

type ReportBarChartProps = {
    bars: Bar[];
    height?: number;
    onPress?: () => void;
};

export function ReportBarChart({ bars, height = 120, onPress }: ReportBarChartProps) {
    const maxValue = Math.max(...bars.map((b) => b.value), 1);
    const barWidth = Math.max(20, Math.min(40, 200 / bars.length));
    const chartWidth = bars.length * (barWidth + 12) + 20;
    const labelHeight = 20;

    const content = (
        <View style={styles.wrap}>
            <Svg width={chartWidth} height={height + labelHeight}>
                {bars.map((bar, i) => {
                    const barH = (bar.value / maxValue) * height;
                    const x = 10 + i * (barWidth + 12);
                    const y = height - barH;
                    return (
                        <React.Fragment key={i}>
                            <Rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barH}
                                rx={4}
                                ry={4}
                                fill={bar.color}
                            />
                            <SvgText
                                x={x + barWidth / 2}
                                y={height + 14}
                                fontSize={10}
                                fontWeight="500"
                                fill="#64748B"
                                textAnchor="middle"
                            >
                                {bar.label}
                            </SvgText>
                        </React.Fragment>
                    );
                })}
            </Svg>
        </View>
    );

    if (onPress) {
        return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
    }
    return content;
}

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
        paddingVertical: 8,
    },
});
