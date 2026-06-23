export const Colors = {
    // Backgrounds
    background: '#FFFFFF',
    surface: '#F8FAFC',   
    card: '#FFFFFF',      
    cardBorder: '#E2E8F0',

    // Brand
    primary: '#3B7BFF',
    primaryDark: '#2563EB',
    primaryLight: '#60A5FA',
    accent: '#00D4FF',
    accentGlow: 'rgba(0, 212, 255, 0.15)',

    // Semantic
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.12)',

    // Text
    textPrimary: '#080D1A',
    textSecondary: '#8A9CC8',
    textMuted: '#4A5780',
    textInverse: '#080D1A',

    // UI
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    overlay: 'rgba(15, 23, 42, 0.5)',
    inputBg: '#F8FAFC',

    // FAB
    fabBg: '#3B7BFF',
    fabShadow: 'rgba(59, 123, 255, 0.45)',
} as const;

export const DocTypeColors = {
    warranty: {
        bg: 'rgba(59, 123, 255, 0.12)',
        border: 'rgba(59, 123, 255, 0.35)',
        text: '#60A5FA',
        dot: '#3B7BFF',
    },
    noWarranty: {
        bg: 'rgba(0, 212, 255, 0.10)',
        border: 'rgba(0, 212, 255, 0.30)',
        text: '#00D4FF',
        dot: '#00D4FF',
    },
    receipt: {
        bg: 'rgba(16, 185, 129, 0.10)',
        border: 'rgba(16, 185, 129, 0.30)',
        text: '#10B981',
        dot: '#10B981',
    },
    contract: {
        bg: 'rgba(245, 158, 11, 0.10)',
        border: 'rgba(245, 158, 11, 0.30)',
        text: '#F59E0B',
        dot: '#F59E0B',
    },
} as const;