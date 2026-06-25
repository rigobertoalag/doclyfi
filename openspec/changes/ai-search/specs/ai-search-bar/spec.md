## ADDED Requirements

### Requirement: Render expandable AI search bar
The system SHALL provide an `AISearchBar` component that expands when activated and provides an animated search experience.

#### Scenario: Animated placeholder rotation
- **WHEN** the component is displayed
- **THEN** the placeholder text SHALL rotate every 3 seconds through the sequence: "¿Qué documentos buscas?" → "Ej: cafés comprados en Liverpool" → "Ej: facturas de luz del año pasado" → "Ej: contratos por vencer"
- **THEN** transitions between placeholders SHALL use a fade animation

#### Scenario: Loading animation while searching
- **WHEN** `status` === `'loading'`
- **THEN** a 3-dot bouncing animation SHALL be displayed (same pattern as OCR loading)

#### Scenario: Close button resets and collapses
- **WHEN** the X button is pressed
- **THEN** it SHALL call `clear()` from the hook
- **THEN** it SHALL call `onClose()` prop
- **THEN** the component SHALL collapse with animation

### Requirement: Follow design system strictly
The component SHALL use the project's design tokens via StyleSheet.create.

#### Scenario: Design tokens applied
- **WHEN** the component renders
- **THEN** background SHALL be `#FFFFFF`
- **THEN** border radius SHALL be 16-20
- **THEN** border SHALL be 1px `#E8EDF5`
- **THEN** text colors SHALL follow: primary `#0F172A`, secondary `#64748B`, placeholder `#94A3B8`
- **THEN** shadows SHALL use iOS shadow (`rgba(59,123,255,0.07)`, offset {0,2}, radius 10) and Android elevation 2

### Requirement: Accept props from parent
The component SHALL receive `onClose`, `query`, `setQuery`, and `status` as props.

#### Scenario: Props interface
- **WHEN** the component is instantiated
- **THEN** it SHALL accept `onClose: () => void`, `query: string`, `setQuery: (q: string) => void`, and `status: 'idle' | 'loading' | 'results' | 'error'`
