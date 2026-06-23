## ADDED Requirements

### Requirement: Income report with deposit type breakdown

The system SHALL display an income report section showing all monetary deposits and income, broken down by deposit type.

#### Scenario: Income section shows total and breakdown
- **WHEN** the user views the reports page
- **THEN** the income section SHALL display total income amount and a donut chart broken down by type: Nómina, Transferencia, Efectivo, Otros

#### Scenario: Each income type has distinct color
- **WHEN** the donut chart renders
- **THEN** Nómina SHALL be green, Transferencia SHALL be blue, Efectivo SHALL be amber, Otros SHALL be gray

#### Scenario: Income list shows type indicators
- **WHEN** income items are displayed
- **THEN** each item SHALL show: amount, date, deposit type with a colored badge, and description

#### Scenario: Chart tap navigates to detail
- **WHEN** the user taps the donut chart
- **THEN** the system SHALL navigate to `/(main)/reports/detail` with params `{ category: 'income', totalAmount, itemCount }`
