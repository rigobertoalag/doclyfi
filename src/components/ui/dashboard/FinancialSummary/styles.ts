import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius:    20,
        borderWidth:     1,
        borderColor:     '#E8EDF5',
        padding:         16,
        marginBottom:    12,
        ...Platform.select({
            ios: {
                shadowColor:   'rgba(59,123,255,0.08)',
                shadowOffset:  { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius:  16,
            },
            android: { elevation: 3 },
        }),
    },

    // Header
    header: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           6,
    },
    title: {
        fontSize:      15,
        fontWeight:    '700',
        color:         '#0F172A',
        letterSpacing: -0.2,
    },
    infoBtn: {
        width:           16,
        height:          16,
        borderRadius:    8,
        backgroundColor: '#EFF6FF',
        borderWidth:     1,
        borderColor:     '#BFDBFE',
        alignItems:      'center',
        justifyContent:  'center',
    },
    infoBtnText: {
        fontSize:   9,
        fontWeight: '700',
        color:      '#3B7BFF',
    },
    periodBtn: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             4,
        backgroundColor: '#F1F5F9',
        borderRadius:    8,
        borderWidth:     1,
        borderColor:     '#E2E8F0',
        paddingHorizontal: 10,
        paddingVertical:   5,
    },
    periodText: {
        fontSize:   12,
        fontWeight: '600',
        color:      '#475569',
    },
    periodArrow: {
        fontSize: 9,
        color:    '#94A3B8',
    },

    // Metrics
    metricsRow: {
        flexDirection: 'row',
        gap:           12,
        marginBottom:  14,
    },
    metric: {
        flex: 1,
        gap:  6,
    },
    metricEmpty: {
        backgroundColor: '#F8FAFF',
        borderRadius:    12,
        borderWidth:     1,
        borderColor:     '#E8EDF5',
        borderStyle:     'dashed',
        padding:         10,
    },
    metricLabel: {
        fontSize:      11,
        fontWeight:    '500',
        color:         '#94A3B8',
        letterSpacing: 0.2,
    },
    metricValueRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
    },
    metricValue: {
        fontSize:      17,
        fontWeight:    '800',
        letterSpacing: -0.5,
    },
    metricDivider: {
        width:           1,
        backgroundColor: '#F1F5F9',
        marginVertical:  2,
    },

    // Empty value dentro de la columna
    emptyValueRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
    },
    emptyValueText: {
        fontSize:      17,
        fontWeight:    '700',
        color:         '#CBD5E1',
        letterSpacing: -0.5,
    },

    // CTA dentro de columna vacía
    missingCta: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             3,
        backgroundColor: '#EFF6FF',
        borderWidth:     1,
        borderColor:     '#BFDBFE',
        borderRadius:    20,
        paddingHorizontal: 8,
        paddingVertical:   4,
        alignSelf:       'flex-start',
    },
    missingCtaText: {
        fontSize:   10,
        fontWeight: '700',
        color:      '#3B7BFF',
    },

    // Trend badge — con dato
    trendBadge: {
        alignSelf:        'flex-start',
        paddingHorizontal: 7,
        paddingVertical:   3,
        borderRadius:     20,
        borderWidth:      1,
    },
    trendText: {
        fontSize:   10,
        fontWeight: '700',
    },
    trendNeutral: {
        alignSelf:        'flex-start',
        paddingHorizontal: 7,
        paddingVertical:   3,
        borderRadius:     20,
        backgroundColor:  '#F8FAFF',
        borderWidth:      1,
        borderColor:      '#E2E8F0',
    },
    trendNeutralText: {
        fontSize:   10,
        fontWeight: '500',
        color:      '#94A3B8',
    },

    // Banner de datos parciales
    banner: {
        flexDirection: 'row',
        alignItems:    'flex-start',
        gap:           8,
        borderRadius:  12,
        borderWidth:   1,
        padding:       11,
        marginBottom:  14,
    },
    bannerContent: { flex: 1, gap: 5 },
    bannerText: {
        fontSize:   11,
        fontWeight: '500',
        lineHeight: 16,
    },
    bannerCta: {
        fontSize:   11,
        fontWeight: '700',
    },

    // Balance
    divider: {
        height:          1,
        backgroundColor: '#F1F5F9',
        marginBottom:    14,
    },
    balanceRow: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
    },
    balanceLabel: {
        fontSize:   13,
        fontWeight: '600',
        color:      '#475569',
    },
    balanceValue: {
        fontSize:      20,
        fontWeight:    '800',
        color:         '#3B7BFF',
        letterSpacing: -0.6,
    },
    balanceIncomplete: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             4,
        backgroundColor: '#F8FAFF',
        borderRadius:    8,
        borderWidth:     1,
        borderColor:     '#E2E8F0',
        paddingHorizontal: 10,
        paddingVertical:   5,
    },
    balanceIncompleteText: {
        fontSize:   12,
        fontWeight: '600',
        color:      '#94A3B8',
    },

    // Empty state completo
    emptyState: {
        alignItems:    'center',
        paddingVertical: 24,
        gap:           10,
    },
    emptyIconWrap: {
        width:           56,
        height:          56,
        borderRadius:    18,
        backgroundColor: '#EFF6FF',
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    4,
    },
    emptyTitle: {
        fontSize:   15,
        fontWeight: '700',
        color:      '#0F172A',
    },
    emptySub: {
        fontSize:   12,
        color:      '#94A3B8',
        textAlign:  'center',
        lineHeight: 18,
        maxWidth:   260,
    },
    emptyBtn: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             6,
        backgroundColor: '#3B7BFF',
        borderRadius:    12,
        paddingHorizontal: 16,
        paddingVertical:   10,
        marginTop:       4,
    },
    emptyBtnText: {
        fontSize:   13,
        fontWeight: '700',
        color:      '#FFFFFF',
    },
});
