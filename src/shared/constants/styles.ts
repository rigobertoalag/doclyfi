import { Platform } from 'react-native';

// ─── Shadow presets ────────────────────────────────────────────────────────────
export const shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: 'rgba(59,123,255,0.06)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: 'rgba(59,123,255,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
    },
    android: { elevation: 3 },
    default: {},
  }),
} as const;

// ─── Card presets ──────────────────────────────────────────────────────────────
export const card = {
  sm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    padding: 14,
    ...shadow.sm,
  },
  md: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    padding: 16,
    ...shadow.sm,
  },
  lg: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    padding: 16,
    ...shadow.md,
  },
} as const;

// ─── Screen container ─────────────────────────────────────────────────────────
export const screen = {
  flex: 1,
  backgroundColor: '#F8FAFF',
} as const;

// ─── Section header (title + "see all") ───────────────────────────────────────
export const sectionHeader = {
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#0F172A',
  },
};

// ─── Semantic status color triplets ────────────────────────────────────────────
export const statusColors = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A' },
  error: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#3B7BFF' },
  purple: { bg: '#FDF4FF', border: '#E9D5FF', text: '#7C3AED' },
  teal: { bg: '#F0FDFA', border: '#99F6E4', text: '#0D9488' },
  sky: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0EA5E9' },
  orange: { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' },
} as const;

// ─── Auth / form presets ───────────────────────────────────────────────────────
export const form = {
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 28,
  } as const,
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EDF5',
    padding: 20,
    ...shadow.md,
  } as const,
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as const,
  inputRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 13,
    paddingHorizontal: 12,
    minHeight: 50,
    gap: 8,
  } as const,
  inputRowError: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  } as const,
  fieldError: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '500',
  } as const,
  backBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
    alignSelf: 'flex-start',
  } as const,
  backText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  } as const,
  switchRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    alignItems: 'center',
  } as const,
  switchText: {
    fontSize: 14,
    color: '#64748B',
  } as const,
  switchLink: {
    fontSize: 14,
    color: '#3B7BFF',
    fontWeight: '700',
  } as const,
} as const;

// ─── Brand section (logo + tagline) ────────────────────────────────────────────
export const brand = {
  section: {
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 13,
    color: '#94A3B8',
  },
} as const;

// ─── Error display ─────────────────────────────────────────────────────────────
export const errorText = {
  banner: {
    flex: 1,
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500' as const,
  },
} as const;

// ─── Naked input (inside a fieldRow) ───────────────────────────────────────────
export const fieldInput = {
  naked: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent' as const,
    paddingLeft: 0,
  },
} as const;

// ─── Search box preset ─────────────────────────────────────────────────────────
export const search = {
  box: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    ...shadow.sm,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  icon: {
    marginRight: 8,
  },
} as const;

// ─── "See all" link ─────────────────────────────────────────────────────────────
export const link = {
  seeAll: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#3B7BFF',
  },
} as const;

// ─── Scroll content container ──────────────────────────────────────────────────
export const contentContainer = {
  default: {
    padding: 16,
    gap: 12,
  },
} as const;

// ─── Button presets ─────────────────────────────────────────────────────────────
export const btn = {
  primary: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(59,123,255,0.30)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  outline: {
    height: 44,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
} as const;

// ─── Alert banners ─────────────────────────────────────────────────────────────
export const alertBanner = {
  error: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
    backgroundColor: statusColors.error.bg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: statusColors.error.border,
  } as const,
  warning: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: statusColors.warning.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: statusColors.warning.border,
    padding: 12,
  } as const,
  info: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: statusColors.info.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: statusColors.info.border,
    padding: 12,
  } as const,
} as const;
