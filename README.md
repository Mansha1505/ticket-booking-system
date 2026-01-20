# Ticket Booking System - Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB Atlas Account (Connection URI)
- Firebase Project (Config Object + Admin Private Key)
- Gemini API Key

## Setup Steps

### 1. Database & Services Setup
- **MongoDB**: Create a cluster on MongoDB Atlas and get the URI.
- **Firebase**:
  - Create a project.
  - Enable Authentication (Email/Password, Google).
  - Generate a new Private Key in Project Settings > Service Accounts (for backend).
  - Get the Client Config object in Project Settings > General (for frontend).
- **Gemini**: Get an API key from Google AI Studio.

### 2. Backend Setup
1. Navigate to `/server`.
2. Rename `.env.example` to `.env`.
3. Fill in the keys:
   ```
   MONGO_URI=...
   GEMINI_API_KEY=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_ADMIT_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=...
   ```
4. Run `npm install`.
5. Run `npm start` (or `npm run dev` for nodemon).

### 3. Frontend Setup
1. Navigate to `/client`.
2. Rename `.env.example` to `.env`.
3. Fill in the Firebase keys (VITE_FIREBASE_...).
4. Run `npm install`.
5. Run `npm run dev`.

### 4. Admin Setup
To create an admin:
1. Register a user via the UI.
2. Manually go to MongoDB Atlas -> Collections -> Users.
3. Find your user query and change the `role` field from `"user"` to `"admin"`.
4. Now you can use Admin API endpoints (UI built mostly for users, utilize Postman for full Admin control if needed).

## Features
- **Search**: Filter events by category or keyword.
- **Booking**: Select Quantity -> Mock Payment -> Confirmation.
- **AI Chatbot**: Click the robot icon to ask about events.
- **Dashboard**: View your booking history.
