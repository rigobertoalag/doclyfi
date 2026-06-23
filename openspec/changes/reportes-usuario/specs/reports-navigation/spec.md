## ADDED Requirements

### Requirement: Chart tap navigates to detail route

The system SHALL navigate to a detail route when the user taps any chart on the reports page.

#### Scenario: Navigation passes category and period params
- **WHEN** the user taps a chart
- **THEN** the system SHALL navigate to `/(main)/reports/detail`
- **AND** pass route params including: `category` (string), `period` (string), `totalAmount` (number), `itemCount` (number)

#### Scenario: Gastos chart passes period
- **WHEN** the user taps the gastos donut chart
- **THEN** params SHALL include `period` set to the currently selected period ("semana", "mes", "3meses")

#### Scenario: Services chart passes period
- **WHEN** the user taps the services bar chart
- **THEN** params SHALL include `period` set to "2m"

#### Scenario: Income chart navigates
- **WHEN** the user taps the income donut chart
- **THEN** params SHALL include `category: 'income'` and current totals

#### Scenario: Contracts chart navigates
- **WHEN** the user taps the contracts donut chart
- **THEN** params SHALL include `category: 'contracts'` and current totals
