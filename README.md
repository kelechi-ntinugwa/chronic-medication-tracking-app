# Chronic Medication Tracking App

This repository contains a comprehensive chronic medication tracking solution. It features a mobile application, a responsive web portal, and a robust backend API.

## Project Structure

- **`/` (Root)**: React Native (Expo) mobile application.
- **`/web-portal`**: Next.js (React) + TypeScript frontend web application providing role-based dashboards for Patients and Providers.
- **`/api`**: ASP.NET Core Web API acting as the secure backend, utilizing Entity Framework Core and PostgreSQL.

## Core Features
- **Role-Based Portals**: Secure dashboards tailored for Patients and Doctors/Providers.
- **Medication & Appointment Tracking**: Book appointments and write/view prescriptions.
- **Video Call Integration**: Telehealth via Daily.co / WebRTC.
- **Encrypted Medical Records**: Field-level encryption for app-level note security using the ASP.NET Data Protection API.
- **Secure Authentication**: JWT and ASP.NET Identity.
- **Digital Card**: View CCMDD card details (Mobile).
- **Directory**: Find pickup points on a map (Mobile).

---

## 1. Backend API (ASP.NET Core)

Located in the `/api` directory.

### Setup & Running

1. **Navigate to the API directory**:
   ```bash
   cd api
   ```
2. **Configure Database**:
   Update the `ConnectionStrings:DefaultConnection` in `appsettings.json` to point to your local PostgreSQL instance.

3. **Apply EF Core Migrations**:
   Run the following command to create the database schema:
   ```bash
   dotnet ef database update
   ```

4. **Start the Development Server**:
   ```bash
   dotnet run
   ```
   The API will typically be accessible at `http://localhost:5233` or `https://localhost:7143`.

---

## 2. Web Portal (Next.js)

Located in the `/web-portal` directory.

### Setup & Running

1. **Navigate to the Web Portal directory**:
   ```bash
   cd web-portal
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The web application will be accessible at `http://localhost:3000`.

---

## 3. Mobile App (React Native / Expo)

Located in the root directory.

### Setup & Configurations

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Firebase Configuration**:
   - Create a project at [firebase.google.com](https://firebase.google.com).
   - Register a Web App and copy the `firebaseConfig` object.
   - Paste it into `src/services/firebase.js`.
3. **Google Maps (Optional for Android)**:
   - Get an API Key from Google Cloud Console.
   - Add it to `app.json` under `android.config.googleMaps.apiKey`.

### Running the Mobile App

Start the Expo development server:
```bash
npx expo start
```
- **Physical Device**: Download **Expo Go** (App Store / Play Store) and scan the QR code.
- **Emulator/Simulator**: Press `a` for Android or `i` for iOS in the terminal.
