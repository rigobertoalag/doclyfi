## ADDED Requirements

### Requirement: Provide AI search state management hook
The system SHALL provide a `useAISearch` hook that manages AI search lifecycle, state, and side effects.

#### Scenario: Hook returns initial idle state
- **WHEN** the hook is first called
- **THEN** it SHALL return `query` as empty string, `results` as empty array, `interpretation` as empty string, `status` as `'idle'`, and `error` as `null`

#### Scenario: Query debounce at 600ms
- **WHEN** `setQuery` is called multiple times within 600ms
- **THEN** the hook SHALL only trigger a search after 600ms of inactivity since the last `setQuery` call

#### Scenario: Query under 3 characters does not trigger search
- **WHEN** `query` has fewer than 3 characters
- **THEN** `status` SHALL remain `'idle'`
- **THEN** the hook SHALL NOT call the search service

#### Scenario: Request cancellation on query change
- **WHEN** a search request is in flight and `setQuery` is called with a new value
- **THEN** the previous request SHALL be aborted via AbortController
- **THEN** a new request SHALL be made for the new query

#### Scenario: Loading state during search
- **WHEN** a search request is in flight
- **THEN** `status` SHALL be `'loading'`

#### Scenario: Successful search updates results
- **WHEN** the search service returns successfully
- **THEN** `status` SHALL be `'results'`
- **THEN** `results` and `interpretation` SHALL be updated from the response
- **THEN** `error` SHALL be `null`

#### Scenario: SESSION_EXPIRED calls logout
- **WHEN** the search service throws `Error('SESSION_EXPIRED')`
- **THEN** the hook SHALL call `logout()` from `AuthContext`
- **THEN** it SHALL NOT update the hook's state

#### Scenario: Other errors update error state
- **WHEN** the search service throws any other error (AI_TIMEOUT, AI_PARSE_ERROR, etc.)
- **THEN** `status` SHALL be `'error'`
- **THEN** `error` SHALL contain the error message

#### Scenario: Clear resets state
- **WHEN** `clear()` is called
- **THEN** `query` SHALL be reset to empty string
- **THEN** `results` SHALL be reset to empty array
- **THEN** `interpretation` SHALL be reset to empty string
- **THEN** `status` SHALL be reset to `'idle'`
- **THEN** `error` SHALL be reset to `null`
