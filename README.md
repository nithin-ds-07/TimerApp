# TimerApp

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/nithin-ds-07/TimerApp.git
cd TimerApp
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Running the App

#### For Android:

```sh
npx run android
```

### 4. Build APK (Android)

```sh
cd android
./gradlew assembleRelease
```

---

## Assumptions

### 1. Local Storage for Timers

- AsyncStorage is used for persisting timers and history instead of a database or backend service.

### 2. Reusable Components

- Common UI elements such as buttons, modals, input fields, and timer displays are implemented as reusable components for better maintainability.

### 3. Basic Navigation

- React Navigation is used with minimal screens (Home, Add, and History).

### 4. Custom Progress Bar

- A custom progress bar is implemented using `View` and `Animated` instead of relying on third-party libraries.

### 5. Minimal Third-Party Dependencies

- The app prioritizes built-in React Native features over external libraries to reduce dependency bloat.

---

## Functionality

- Users can add timers to the list.
- Timers can be started, paused, or reset individually.
- Bulk actions are available to start, pause, or reset timers.
- Timers are grouped by categories with expandable sections.
- A custom progress bar shows timer progress.
- Completed timers are logged in history.
- Data is persisted using AsyncStorage.
- Users can enable a notification option to be notified at 50% timer completion.
- A completion alert message is shown only for individual timers, not for bulk actions.
