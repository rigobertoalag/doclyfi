## ADDED Requirements

### Requirement: Integrate AI search into DocumentsScreen
The system SHALL provide an AI search mode toggle within the existing DocumentsScreen, accessible via an "IA" button.

#### Scenario: IA button next to search bar
- **WHEN** `aiMode` is `false` (default)
- **THEN** the existing search bar SHALL be displayed normally
- **THEN** an "IA" button SHALL appear to the right of the search bar
- **THEN** the button SHALL have background `#EFF6FF`, border `#BFDBFE`, and text/icon color `#3B7BFF`
- **THEN** pressing the button SHALL set `aiMode` to `true`

#### Scenario: AI mode replaces search bar
- **WHEN** `aiMode` is `true`
- **THEN** the normal search bar SHALL be replaced by `AISearchBar`
- **THEN** `AISearchBar` SHALL receive `onClose` that sets `aiMode` to `false` and calls `clear()`

#### Scenario: AI mode hides category chips and sort
- **WHEN** `aiMode` is `true`
- **THEN** category filter chips SHALL be hidden
- **THEN** sort row SHALL be hidden
- **THEN** `AISearchResults` SHALL be displayed below `AISearchBar`

#### Scenario: Restore normal mode on close
- **WHEN** AI mode closes
- **THEN** `aiMode` SHALL become `false`
- **THEN** category chips and sort row SHALL reappear immediately
- **THEN** the normal search bar SHALL reappear
