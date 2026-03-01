# Chronic Medication Tracking App

A React Native application for tracking chronic medication, built with Expo and Firebase.

## Features
- **Medication Calendar**: Track pickup dates.
- **Digital Card**: View your CCMDD card details.
- **Reminders**: Get notified before your pickup.
- **Directory**: Find pickup points on a map.
- **Stock Alerts**: Report and view stock shortages.
- **Health Log**: Track chronic conditions.
- **Patient & Doctor Roles**: Secure portal for different user types.
- **Secure Login**: Using JWT and ASP.NET Identity.
- **Book Appointments**: Schedule visits with healthcare providers.
- **Video Call Integration**: Telehealth via WebRTC, Twilio, or Daily.co.
- **Encrypted Medical Records**: Field encryption for app-level note security.
- **Prescription PDF Generation**: Automatically generate downloadable prescriptions.

## System Architecture (Planned for Web Portal)

### Frontend
- Next.js (React) + TypeScript
- TailwindCSS

### Backend (API)
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Identity & JWT authentication

### Database & Storage
- PostgreSQL
- Azure Blob / Amazon S3 / Cloudflare R2 for file storage

### Integrations & Security
- **Video**: Twilio Video or Daily.co
- **Security**: Data Protection API (for tokens), Basic OWASP checks, Field encryption for notes (app-level)
- **Testing**: xUnit with integration tests

### Deployment
- Azure App Service (API)
- Azure Database for PostgreSQL (or Render)

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Firebase Configuration**:
    - Create a project at [firebase.google.com](https://firebase.google.com).
    - Register a Web App.
    - Copy the `firebaseConfig` object.
    - Paste it into `src/services/firebase.js`.

3.  **Google Maps (Optional for Android)**:
    - Get an API Key from Google Cloud Console.
    - Add it to `app.json` under `android.config.googleMaps.apiKey`.

## Running the App

Start the development server:

```bash
npx expo start
```

- **Physical Device**: Download the **Expo Go** app (App Store / Play Store) and scan the QR code.
- **Android Emulator**: Press `a` in the terminal (requires Android Studio).
- **iOS Simulator**: Press `i` in the terminal (requires Xcode on Mac).
- **Web Browser**: Press `w` in the terminal.
