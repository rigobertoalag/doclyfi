## ADDED Requirements

### Requirement: Edit profile calls real API

The edit profile screen SHALL persist changes via `PUT /webhook/auth/profile` instead of using a mocked timeout.

#### Scenario: Successful profile update
- **WHEN** the user fills in name and phone and taps "Guardar cambios"
- **THEN** the system SHALL call `api.put('auth/profile', { fullName, phone })`
- **AND** on success, update the local user state via `updateUser()`
- **AND** navigate back to the profile screen

#### Scenario: Profile update validation error
- **WHEN** the API returns a validation error
- **THEN** the system SHALL display the error message from the API response

#### Scenario: Profile update network error
- **WHEN** the network request fails
- **THEN** the system SHALL show "Error de conexión. Intenta de nuevo."

### Requirement: Change password calls real API

The change password screen SHALL persist changes via `PUT /webhook/auth/password`.

#### Scenario: Successful password change
- **WHEN** the user fills in current, new, and confirm password and taps "Actualizar contraseña"
- **THEN** the system SHALL call `api.put('auth/password', { currentPassword, newPassword })`
- **AND** on success, show an Alert "Contraseña actualizada correctamente"
- **AND** navigate back to the profile screen

#### Scenario: Password change wrong current password
- **WHEN** the current password is incorrect
- **THEN** the system SHALL display "La contraseña actual no es correcta" as a field error

#### Scenario: Password change validation error from server
- **WHEN** the server rejects the new password
- **THEN** the system SHALL display the server's error message

### Requirement: API client supports multipart uploads

The `apiClient` SHALL support file uploads for the avatar feature.

#### Scenario: API upload method exists
- **WHEN** the system needs to upload an image file
- **THEN** it SHALL use `api.upload('auth/avatar', formData)` which sends `multipart/form-data`
- **AND** include the Bearer token in the request
