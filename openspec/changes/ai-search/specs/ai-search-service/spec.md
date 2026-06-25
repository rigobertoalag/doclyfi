## ADDED Requirements

### Requirement: Search documents via AI webhook
The system SHALL provide a `searchDocuments(query: string)` function that sends the user's query to the AI search backend.

#### Scenario: Successful search returns results
- **WHEN** the function is called with valid query "facturas de luz"
- **THEN** it SHALL make a GET request to `/webhook/ai-search?q=facturas%20de%20luz` with `Authorization: Bearer <token>` header
- **THEN** it SHALL return a response with `query_interpretation`, `results` array (typed as `DocItem[]`), and `total` count

#### Scenario: Token validation before request
- **WHEN** the function is called
- **THEN** it SHALL read the token using `authStorage.getToken()`
- **THEN** it SHALL validate the token with `authStorage.isTokenExpired(token)`
- **THEN** if expired, it SHALL throw `Error('SESSION_EXPIRED')` without making the HTTP request

#### Scenario: 401 response handling
- **WHEN** the API returns status 401
- **THEN** the function SHALL throw `Error('SESSION_EXPIRED')`

#### Scenario: 400 response handling
- **WHEN** the API returns status 400
- **THEN** the function SHALL throw `Error('QUERY_TOO_SHORT')`

#### Scenario: 504 response handling
- **WHEN** the API returns status 504
- **THEN** the function SHALL throw `Error('AI_TIMEOUT')`

#### Scenario: 422 response handling
- **WHEN** the API returns status 422
- **THEN** the function SHALL throw `Error('AI_PARSE_ERROR')`

#### Scenario: Client-side timeout
- **WHEN** the request takes longer than 20 seconds
- **THEN** the function SHALL abort the request via AbortController

#### Scenario: Uses native fetch
- **WHEN** making the HTTP request
- **THEN** it SHALL use the native `fetch` API (not axios)
- **THEN** the URL base SHALL be `process.env.EXPO_PUBLIC_N8N_URL`
