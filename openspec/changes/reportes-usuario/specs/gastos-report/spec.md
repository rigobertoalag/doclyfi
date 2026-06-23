## ADDED Requirements

### Requirement: Gastos report with period selector

The system SHALL display an expense report section with a period selector and a donut chart breaking down expenses by subcategory.

#### Scenario: Default period is current week
- **WHEN** the user navigates to the reports page
- **THEN** the gastos section SHALL display expenses for the current week by default
- **AND** a horizontal pill selector SHALL show "Semana", "Mes", "3 Meses" options with "Semana" selected

#### Scenario: Period selector changes data
- **WHEN** the user taps "Mes"
- **THEN** the chart and summary SHALL update to show current month expenses
- **WHEN** the user taps "3 Meses"
- **THEN** the chart and summary SHALL update to show last 3 months of expenses

#### Scenario: Donut chart shows category breakdown
- **WHEN** expense data is displayed
- **THEN** a donut chart SHALL show segments for subcategories: Alimentación, Transporte, Vivienda, Salud, Entretenimiento, Otros
- **AND** each segment SHALL have a distinct color

#### Scenario: Warranty purchases are marked
- **WHEN** an expense item has a warranty
- **THEN** the item SHALL display a warranty badge or icon in the summary list
- **AND** the chart segment for warranty items SHALL use the blue warranty color

#### Scenario: Summary shows totals
- **WHEN** expense data is displayed
- **THEN** below the chart SHALL show: total amount, number of transactions, and average per transaction

#### Scenario: Chart tap navigates to detail
- **WHEN** the user taps the donut chart
- **THEN** the system SHALL navigate to `/(main)/reports/detail` with params `{ category: 'gastos', period, totalAmount, itemCount }`

### Requirement: Expense summary list

Below the chart, the system SHALL show a scrollable list of recent expense items.

#### Scenario: Expense list renders items
- **WHEN** expense data is available
- **THEN** a list SHALL show each expense with: merchant name, amount, date, category icon
- **AND** items with warranty SHALL show a warranty badge

#### Scenario: Limited items shown
- **WHEN** there are more than 5 expense items
- **THEN** only the first 5 SHALL be shown with a "Ver más" link
