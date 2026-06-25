## ADDED Requirements

### Requirement: Display AI search results
The system SHALL provide an `AISearchResults` component that renders interpretation, results, empty state, and errors based on the hook state.

#### Scenario: Interpretation chip shown when results available
- **WHEN** `status` === `'results'` and `interpretation` is non-empty
- **THEN** a chip SHALL be displayed with background `#EFF6FF`, border `#BFDBFE`, and text color `#3B7BFF`
- **THEN** an Ionicons icon (sparkles/bulb) SHALL appear on the left
- **THEN** text SHALL read `"Buscando: {interpretation}"`

#### Scenario: Results list with accented rows
- **WHEN** `results.length > 0`
- **THEN** a counter SHALL display "Se encontraron X documentos"
- **THEN** each result SHALL render using the `DocumentRow` component
- **THEN** `accentColor` SHALL depend on `categoryId`: warranty `#3B7BFF`, invoice `#C2410C`, deposit `#7C3AED`, services `#0EA5E9`, contracts `#0D9488`

#### Scenario: Empty state with suggestions
- **WHEN** `status` === `'results'` and `results.length === 0`
- **THEN** a large `search-outline` icon (color `#CBD5E1`) SHALL be displayed
- **THEN** title SHALL read "Sin resultados para tu búsqueda"
- **THEN** subtitle SHALL read "Intenta con otras palabras o sé más específico"
- **THEN** suggestion chips SHALL be shown: "compras con garantía", "servicios pendientes", "contratos por vencer"
- **THEN** tapping a suggestion SHALL call `setQuery` with that suggestion text

#### Scenario: Error state messages
- **WHEN** `status` === `'error'`
- **THEN** a human-readable message SHALL be shown based on error type:
  - `AI_TIMEOUT`: "La búsqueda tardó demasiado, intenta de nuevo"
  - `AI_PARSE_ERROR`: "No se pudo procesar tu búsqueda, reformúlala"
  - default: "Error al buscar, verifica tu conexión"

### Requirement: Reuse DocumentRow component
The results list SHALL reuse the existing `DocumentRow` component without modification.

#### Scenario: DocumentRow props
- **WHEN** rendering each result item
- **THEN** `doc` prop SHALL be the `DocItem`
- **THEN** `isLast` SHALL indicate if this is the last item
- **THEN** `accentColor` SHALL be determined by `categoryId` as specified
