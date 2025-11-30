# Setup Guide - Family Finance Tracker

This guide will walk you through setting up the Family Finance Tracker step-by-step. Perfect for beginners!

## 📋 What You'll Need

- A computer with internet connection
- About 30 minutes of time
- No prior coding experience required!

## Step 1: Install Node.js

Node.js is required to run this application.

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the instructions
4. To verify installation, open Command Prompt (Windows) or Terminal (Mac/Linux) and type:
   ```bash
   node --version
   ```
   You should see a version number like `v18.x.x`

## Step 2: Download the Project

1. Download this project as a ZIP file or clone it using Git
2. Extract the ZIP file to a folder on your computer
3. Remember the folder location (e.g., `C:\Users\YourName\family-finance-tracker`)

## Step 3: Install Project Dependencies

1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Navigate to the project folder:
   ```bash
   cd path/to/family-finance-tracker
   ```
   Example: `cd C:\Users\YourName\family-finance-tracker`

3. Install all required packages:
   ```bash
   npm install
   ```
   This will take a few minutes. You'll see a progress bar.

## Step 4: Set Up Firebase

Firebase is the backend service that stores your data.

### 4.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "My Finance Tracker")
4. Disable Google Analytics (optional, you can enable it later)
5. Click "Create project"

### 4.2 Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Enable "Email/Password":
   - Click on "Email/Password"
   - Toggle the first switch to enable
   - Click "Save"
4. Enable "Google" (optional):
   - Click on "Google"
   - Toggle to enable
   - Select a support email
   - Click "Save"

### 4.3 Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you
5. Click "Enable"

### 4.4 Get Your Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app with a nickname (e.g., "Finance Tracker Web")
6. Click "Register app"
7. You'll see a config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

## Step 5: Configure Environment Variables

1. In the project folder, find the file `.env.example`
2. Make a copy of it and rename it to `.env` (remove `.example`)
3. Open `.env` in a text editor (Notepad, VS Code, etc.)
4. Replace the placeholder values with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Save the file

## Step 6: Set Up Firestore Security Rules

1. Go back to Firebase Console
2. Click "Firestore Database"
3. Click the "Rules" tab
4. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Budgets collection
    match /budgets/{budgetId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Other collections (for future features)
    match /recurringPayments/{docId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    match /savingsGoals/{docId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    match /billReminders/{docId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

5. Click "Publish"

## Step 7: Run the Application

1. In Command Prompt/Terminal, make sure you're in the project folder
2. Start the development server:
   ```bash
   npm run dev
   ```
3. You should see output like:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```
4. Open your web browser and go to `http://localhost:3000`

## Step 8: Create Your Account

1. Click "Sign up" on the login page
2. Enter your name, email, and password
3. Click "Sign Up"
4. You're in! 🎉

## Step 9: Start Using the App

1. Click "Add Income" or "Add Expense" to create your first transaction
2. Explore the Analytics page to see charts
3. Try exporting your data to Excel
4. Toggle dark mode in the top right corner

## 🎓 Tips for Beginners

- **Don't worry about making mistakes**: You can always delete transactions
- **Start simple**: Add a few transactions to see how it works
- **Explore the features**: Click around and see what each page does
- **Use realistic data**: This will help you see the value of the insights
- **Check the Analytics page**: It gets better as you add more data

## 🆘 Troubleshooting

### "npm: command not found"
- Node.js isn't installed properly. Go back to Step 1.

### "Firebase: Error (auth/...)"
- Check that your `.env` file has the correct Firebase credentials
- Make sure Authentication is enabled in Firebase Console

### "Permission denied" errors
- Check your Firestore security rules (Step 6)
- Make sure you're logged in to the app

### Port 3000 already in use
- Another app is using port 3000
- Change the port in `vite.config.js` or stop the other app

### App doesn't load or shows blank page
- Check the browser console for errors (F12 key)
- Make sure all dependencies installed correctly (`npm install`)
- Try deleting `node_modules` folder and running `npm install` again

## 📞 Need More Help?

- Check the README.md file
- Look at the Firebase documentation
- Search for error messages online
- Ask in developer communities

## 🎉 You're All Set!

Congratulations! You've successfully set up the Family Finance Tracker. Start tracking your finances and gain insights into your spending habits!

---

**Next Steps**: Check out [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to learn how to deploy your app online.
