## ADDED Requirements

### Requirement: Contracts report with payment-linked contracts

The system SHALL display contracts that have linked payment obligations, showing installment schedules and amounts.

#### Scenario: Contracts section shows only payment-linked contracts
- **WHEN** the user views the reports page
- **THEN** the contracts section SHALL only display contracts that have financial payment obligations
- **AND** contracts without payment terms SHALL be excluded

#### Scenario: Donut chart shows paid vs pending
- **WHEN** contract data is displayed
- **THEN** a donut chart SHALL show the proportion of paid vs pending installments across all contracts

#### Scenario: Contract list with installment progress
- **WHEN** contracts are displayed
- **THEN** each contract SHALL show: contract name, total amount, paid amount, pending amount, and installment progress bar
- **AND** the next pending payment date SHALL be shown

#### Scenario: Chart tap navigates to detail
- **WHEN** the user taps the donut chart
- **THEN** the system SHALL navigate to `/(main)/reports/detail` with params `{ category: 'contracts', totalAmount, itemCount }`
