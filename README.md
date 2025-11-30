# Family Finance Tracker 💰

A complete full-stack web application for tracking family finances with income/expense management, analytics, smart insights, and collaborative features.

## ✨ Features

### Core Features
- **Authentication**: Email/password and Google Sign-In with Firebase Auth
- **Income & Expense Tracking**: Track all your financial transactions with categories
- **Need/Want/Luxury Classification**: Categorize expenses for better spending insights
- **Charts & Analytics**: Beautiful visualizations using Recharts
  - Monthly income vs expenses
  - Category-wise breakdown
  - Need/Want/Luxury distribution
  - Yearly trends
  - Savings graphs
- **Smart Insights**: AI-powered spending analysis and recommendations
  - Overspending warnings
  - Savings rate analysis
  - Category alerts
  - Spending pattern detection
- **Spreadsheet Export**: Download your data in XLSX or CSV format
- **Dark Mode**: Beautiful dark theme support
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Additional Features (Placeholders for Future Development)
- Budget Planner
- Family Shared Accounts
- Recurring Payments
- Smart Savings Goals
- Bill Reminders
- Expense Prediction
- AI-Based Spending Insights

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Charts**: Recharts
- **Export**: SheetJS (xlsx)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
family-finance-tracker/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 16+ installed
- Firebase account
- Git (optional)

### Installation

1. **Clone or download this project**
   ```bash
   cd family-finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Copy your Firebase config

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Firebase credentials

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Detailed Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for step-by-step instructions suitable for beginners.

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for instructions on deploying to Vercel.

## 📊 Firebase Firestore Structure

```
users/
  {userId}/
    - email
    - displayName
    - createdAt
    - familyId (optional)
    - role

transactions/
  {transactionId}/
    - userId
    - type (income/expense)
    - amount
    - category
    - date
    - notes
    - expenseType (need/want/luxury)
    - createdAt
    - updatedAt

budgets/
  {budgetId}/
    - userId
    - category
    - limit
    - month
    - createdAt

(Additional collections for future features)
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### Categories
Edit `src/utils/constants.js` to modify income/expense categories.

## 🤝 Contributing

This is a beginner-friendly project! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🙏 Acknowledgments

- Built with React and Firebase
- UI inspired by modern finance apps
- Icons by Lucide
- Charts by Recharts

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the developer.

---

**Happy Tracking! 💰📈**
