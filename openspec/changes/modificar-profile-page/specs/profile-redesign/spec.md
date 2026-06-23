## ADDED Requirements

### Requirement: Redesigned profile layout with stats and sections

The profile screen SHALL display user information in a structured, sectioned layout with statistics, settings, and subscription status.

#### Scenario: Profile screen renders user info
- **WHEN** the user navigates to the profile tab
- **THEN** the screen SHALL display the user's avatar, full name, email, and plan badge at the top

#### Scenario: Profile shows usage stats
- **WHEN** the profile screen loads
- **THEN** it SHALL display a stats row with: documents processed count, storage used, and account age
- **AND** stats SHALL be fetched from `GET /webhook/user/stats`

#### Scenario: Stats card shows loading state
- **WHEN** stats are being fetched
- **THEN** the stats card SHALL show skeleton placeholders

#### Scenario: Stats card shows error state
- **WHEN** stats fetch fails
- **THEN** the stats card SHALL show a retry button with "Error al cargar estadísticas" message

### Requirement: Extracted reusable profile components

The profile screen SHALL use reusable components from `src/components/profile/` instead of inline UI.

#### Scenario: ProfileAvatar component renders
- **WHEN** `ProfileAvatar` receives a `uri` prop
- **THEN** it SHALL display the image
- **WHEN** `uri` is null
- **THEN** it SHALL display a colored circle with the first letter of the user's name

#### Scenario: ProfileAvatar supports edit action
- **WHEN** the user taps the avatar
- **THEN** it SHALL trigger the `onEdit` callback

#### Scenario: ProfileStatCard displays metric
- **WHEN** `ProfileStatCard` receives `label`, `value`, and `icon` props
- **THEN** it SHALL display the icon, formatted value, and label in a card layout

#### Scenario: ProfileSectionCard expands and collapses
- **WHEN** the user taps a `ProfileSectionCard` header
- **THEN** the section SHALL toggle between expanded and collapsed states with animation

### Requirement: Settings sections

The profile screen SHALL include sections for app settings: notifications, language, and theme.

#### Scenario: Notification toggle exists
- **WHEN** the user views the settings section
- **THEN** they SHALL see a toggle for enabling/disabling push notifications

#### Scenario: Language selector exists
- **WHEN** the user views the settings section
- **THEN** they SHALL see the current language displayed with an option to change it

#### Scenario: Theme toggle exists
- **WHEN** the user views the settings section
- **THEN** they SHALL see a toggle for light/dark theme (UI only, dark mode not implemented yet)

### Requirement: Footer with version and logout

The profile screen SHALL include a footer section with app version and logout button.

#### Scenario: Footer shows app version
- **WHEN** the profile screen renders
- **THEN** the footer SHALL display the app version from `expo-constants`

#### Scenario: Logout shows confirmation
- **WHEN** the user taps "Cerrar sesión"
- **THEN** an Alert SHALL ask for confirmation before executing logout
