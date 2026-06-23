## ADDED Requirements

### Requirement: Display current subscription plan with status

The profile screen SHALL show the user's current plan, its features, and usage against plan limits.

#### Scenario: Plan badge displays correct plan info
- **WHEN** the profile screen renders
- **THEN** the plan badge SHALL show the plan name, color, and icon from the `PLANS` constant
- **AND** the badge styling SHALL match the plan's configured color scheme

#### Scenario: Usage shows quota vs limit
- **WHEN** stats are loaded
- **THEN** the stats card SHALL display document usage as a fraction (e.g., "12 / 250 documentos")
- **AND** storage usage as a fraction (e.g., "45 MB / 250 MB")
- **AND** a progress bar SHALL indicate usage percentage

#### Scenario: Near-limit warning
- **WHEN** document or storage usage exceeds 80% of the plan limit
- **THEN** the progress bar SHALL turn yellow/orange
- **AND** a warning text SHALL appear: "Estás cerca del límite de tu plan"

#### Scenario: Plan limit reached
- **WHEN** document or storage usage reaches 100% of the plan limit
- **THEN** the progress bar SHALL turn red
- **AND** an upgrade CTA SHALL appear: "Actualiza tu plan para seguir usando Doclyfi"

### Requirement: Upgrade call-to-action

The profile screen SHALL provide a clear path to upgrade the user's plan.

#### Scenario: Upgrade button navigates to plans modal
- **WHEN** the user taps "Actualizar plan" or "Mi plan"
- **THEN** the system SHALL navigate to `/(modals)/plans`

#### Scenario: Free plan shows upgrade prompt in stats card
- **WHEN** the user's plan is `'free'`
- **THEN** the stats section SHALL include an upgrade prompt with benefit text and a "Ver planes" button
