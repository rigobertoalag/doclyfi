## 1. Mock data and chart utilities

- [x] 1.1 Create `src/mocks/reports.ts` with mock financial data for all 5 categories (gastos, servicios, ingresos, contratos) with realistic amounts, dates, types, and statuses
- [x] 1.2 Create `src/components/reports/ReportDonut.tsx` — hand-rolled SVG donut chart component using `react-native-svg` with `Circle` arcs and a center label
- [x] 1.3 Create `src/components/reports/ReportBarChart.tsx` — hand-rolled SVG vertical bar chart using `react-native-svg` `Rect` elements
- [x] 1.4 Create `src/components/reports/ReportSummaryRow.tsx` — reusable summary row (label, formatted amount, color dot)
- [x] 1.5 Create `src/components/reports/ReportPeriodPills.tsx` — horizontal pill selector for period options (semana/mes/3meses)
- [x] 1.6 Create `src/components/reports/index.ts` — barrel export for all report components

## 2. Gastos report section

- [x] 2.1 Build donut chart with subcategory segments (Alimentación, Transporte, Vivienda, Salud, Entretenimiento, Otros)
- [x] 2.2 Add period selector (Semana / Mes / 3 Meses) with data filtering
- [x] 2.3 Add expense summary list with merchant, amount, date, warranty badge
- [x] 2.4 Implement chart tap → navigation to `/(main)/reports/detail` with params

## 3. Services report section

- [x] 3.1 Build bar chart with monthly totals for last 2 months
- [x] 3.2 Add category breakdown list (Agua, Luz, Internet, Teléfono, Colegiatura, Otros)
- [x] 3.3 Show paid vs pending totals
- [x] 3.4 Implement chart tap navigation

## 4. Income report section

- [x] 4.1 Build donut chart with income types (Nómina, Transferencia, Efectivo, Otros)
- [x] 4.2 Add income list with type badges and descriptions
- [x] 4.3 Implement chart tap navigation

## 5. Contracts report section

- [x] 5.1 Build donut chart with paid vs pending installment proportion
- [x] 5.2 Add contract list with installment progress bars and next payment dates
- [x] 5.3 Implement chart tap navigation

## 6. Reports dashboard assembly

- [x] 6.1 Rewrite `src/app/(main)/reports.tsx` with all 5 category sections in a ScrollView
- [x] 6.2 Add section headers with category icons and colors
- [x] 6.3 Wire all mock data and chart navigation
