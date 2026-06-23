## Context

The reports tab is a blank placeholder. The app has 5 well-defined document categories (gastos/facturación, compras con garantía, servicios, depósitos/ingresos, contratos) with established color schemes, mock data, and capture flows. No chart library is installed — only `react-native-svg` (15.12.1), which the services modal already uses for a hand-rolled donut chart. Category colors are defined in `CategoryGrid/data.ts` and `statusColors` in `styles.ts`.

## Goals / Non-Goals

**Goals:**
- Render 5 color-coded report sections, each with an SVG donut/bar chart + summary data
- Gastos section: period selector (semana, mes, 3 meses) with warranty badge on applicable items
- Servicios section: last 2 months of service payments by default, category breakdown
- Ingresos section: income by type (nómina, transferencia, efectivo)
- Contratos section: contracts with linked payments, installment schedule
- Chart tap navigates to a detail route (to be defined) with basic params
- All charts use `react-native-svg` — no new chart library dependency
- Mock data covers all categories with realistic amounts and dates

**Non-Goals:**
- Not building the detail screens (just passing params)
- Not integrating real API data (all mock for now)
- Not including IDs (identificaciones) category in reports
- Not adding data export or PDF generation

## Decisions

1. **Use `react-native-svg` for all charts** — already a dependency, used in services modal. Hand-rolled donut charts (PieShape via `Circle` with `strokeDasharray`) and bar charts (`Rect`). Avoids adding 100kb+ chart libraries for what is essentially 5 static charts.
2. **Mock data in `src/mocks/reports.ts`** — follows the existing `src/mocks/` pattern (`services.ts`, `dashboard.ts`, `ocr.ts`). Each category gets its own data set with fields like `amount`, `date`, `category`, `type`, `status`.
3. **Layout: single ScrollView with section cards** — each category is a `ReportCategoryCard` component containing a chart + summary row. Cards use the category's accent color for the chart. This follows the existing card-based layout pattern.
4. **Period selector as horizontal pill row** — reuses the pill UI pattern from the services modal's month tabs. Options: "Semana", "Mes", "3 Meses". Default: "Semana".
5. **Chart → Detail navigation** — tapping a chart pushes to `/(main)/reports/detail` with `route.params` containing `{ category, period, totalAmount, itemCount }`. The detail screen itself is out of scope.
6. **Category colors map to existing app colors** — uses `statusColors` from `styles.ts` and `CategoryGrid/data.ts` bg/border colors for consistency:
   - Gastos: orange (`#C2410C`)
   - Garantía: blue (`#3B7BFF`)
   - Servicios: sky (`#0EA5E9`)
   - Ingresos: green (`#16A34A`)
   - Contratos: purple (`#7C3AED`)

## Risks / Trade-offs

- **[Risk] Hand-rolled SVG charts may lack polish** — custom SVG donut/bar charts won't have animations or touch interactions unless built manually. **Mitigation**: keep charts simple (static segments, clean labels) and rely on tap navigation for detail. Animation can be added later.
- **[Trade-off] All data is mocked** — real API integration is deferred. The mock data file is structured to match a future API response shape so migration is straightforward.
