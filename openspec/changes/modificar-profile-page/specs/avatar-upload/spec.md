## ADDED Requirements

### Requirement: Avatar upload from camera or gallery

The system SHALL allow users to upload or change their profile avatar using the device camera or photo gallery.

#### Scenario: User taps avatar to change
- **WHEN** the user taps their avatar on the profile screen
- **THEN** a bottom sheet or action sheet SHALL appear with options: "Tomar foto", "Elegir de galería", "Cancelar"

#### Scenario: User picks from gallery
- **WHEN** the user selects "Elegir de galería"
- **THEN** the system SHALL request media library permissions
- **AND** if granted, open the image picker with `allowsEditing: true` and `aspect: [1, 1]`
- **AND** upload the selected image to `POST /webhook/auth/avatar` as multipart/form-data
- **AND** on success, update the user's `avatarUrl` optimistically

#### Scenario: User takes photo with camera
- **WHEN** the user selects "Tomar foto"
- **THEN** the system SHALL request camera permissions
- **AND** if granted, open the camera with `allowsEditing: true` and `aspect: [1, 1]`
- **AND** upload the captured image to `POST /webhook/auth/avatar` as multipart/form-data
- **AND** on success, update the user's `avatarUrl` optimistically

#### Scenario: Upload failure shows error
- **WHEN** the avatar upload fails
- **THEN** the system SHALL show an error toast: "Error al actualizar foto de perfil"
- **AND** revert to the previous avatar

### Requirement: Avatar is persisted across sessions

The avatar URL SHALL be persisted in SecureStore as part of the user object and restored on app launch.

#### Scenario: Avatar loads from saved session
- **WHEN** the app launches and restores a saved session
- **THEN** the user's `avatarUrl` SHALL be included in the restored `User` object
- **AND** the profile screen SHALL display the saved avatar image
