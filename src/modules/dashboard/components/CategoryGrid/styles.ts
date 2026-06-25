import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E8EDF5',
        padding: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(59,123,255,0.08)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 16,
            },
            android: { elevation: 3 },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        letterSpacing: -0.2,
    },
    link: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3B7BFF',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    rowGap: {
        marginBottom: 10,
    },

    catCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 0,
        paddingBottom: 10,
        minHeight: 100,
    },
    catNumber: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 0.3,
        marginBottom: 8,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 13,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 1,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    emoji: {
        fontSize: 22,
    },
    catName: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1E293B',
        lineHeight: 15,
        flex: 1,
        textAlign: 'center',
        letterSpacing: -0.1,
    },
    catArrow: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3B7BFF',
        marginTop: 6,
    },

    newDocCard: {
        backgroundColor: '#F8FAFF',
        borderStyle: 'dashed',
        borderColor: '#93C5FD',
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'transparent',
        elevation: 0,
    },
    newPlusCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    newPlus: {
        fontSize: 20,
        fontWeight: '300',
        color: '#3B7BFF',
        lineHeight: 24,
    },
    newLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#3B7BFF',
        textAlign: 'center',
        lineHeight: 16,
        letterSpacing: -0.1,
    },

    catImage: {
        width: 68,
        height: 68,
        resizeMode: 'contain',
    },
});
