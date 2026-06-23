## Why

The reports page is currently a placeholder ("Próximamente") with no functionality. Users need a centralized dashboard to visualize their financial data across all Doclyfi categories — expenses, income, services, contracts — with charts and period filters. This is a core feature for financial tracking and a key differentiator.

## What Changes

- Replace the placeholder `reports.tsx` with a full reports dashboard
- Add 5 category report sections, each with a color-coded chart and data summary
- Implement period selector (semana actual, mes actual, último mes, últimos 3 meses) for gastos section
- Add chart navigation — tapping a chart navigates to a detail route passing basic data params
- Create reusable chart components using `react-native-svg` (existing dependency)
- Create mock financial data covering all categories for development
- Add `src/components/reports/` directory with chart and card components

## Capabilities

### New Capabilities
- `gastos-report`: Weekly/monthly expense breakdown with period selector, warranty marking, and donut chart
- `services-report`: Service payment history for last 2 months with category breakdown
- `income-report`: Deposit and income overview with type indicators (nómina, transferencia, efectivo)
- `contracts-report`: Contract payment schedules linked to financial obligations
- `reports-navigation`: Chart tap → detail route with data params

### Modified Capabilities
None

## Impact

- `src/app/(main)/reports.tsx` — complete rewrite from placeholder to full dashboard
- `src/components/reports/` — new component directory (chart primitives, category cards)
- `src/mocks/reports.ts` — new mock data file with realistic financial data per category
- `src/lib/routes.ts` — potential new route for chart detail screen (defined later)
- `src/constants/` — no changes expected, reuses existing statusColors and category configs
