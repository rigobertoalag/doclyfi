## ADDED Requirements

### Requirement: Services report with 2-month default

The system SHALL display a service payments report section defaulting to the last 2 months of data.

#### Scenario: Services report loads with last 2 months
- **WHEN** the user navigates to the reports page
- **THEN** the services section SHALL display payment data for the current and previous month

#### Scenario: Bar chart shows monthly totals
- **WHEN** service payment data is displayed
- **THEN** a vertical bar chart SHALL show total paid per month for the last 2 months
- **AND** each bar SHALL be color-coded by service category (Agua, Luz, Internet, Teléfono, Colegiatura, Otros)

#### Scenario: Category breakdown displayed
- **WHEN** service data is available
- **THEN** below the chart SHALL show a breakdown list with each service category, amount paid, and number of payments

#### Scenario: Paid vs pending summary
- **WHEN** service data is displayed
- **THEN** the section SHALL show total paid, total pending, and payment count

#### Scenario: Chart tap navigates to detail
- **WHEN** the user taps the bar chart
- **THEN** the system SHALL navigate to `/(main)/reports/detail` with params `{ category: 'services', period: '2m', totalAmount, itemCount }`
