# Deployment Guide - Family Finance Tracker

This guide will help you deploy your Family Finance Tracker to the internet so you can access it from anywhere!

## 🌐 Deployment Options

We'll cover deployment to **Vercel** (recommended for beginners) and provide tips for other platforms.

---

## Option 1: Deploy to Vercel (Recommended)

Vercel is free, fast, and perfect for React applications.

### Prerequisites
- Your app working locally (completed SETUP_GUIDE.md)
- A GitHub account (free)
- A Vercel account (free)

### Step 1: Push Your Code to GitHub

1. **Create a GitHub account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Click "Sign up"
   - Follow the instructions

2. **Create a new repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Name it "family-finance-tracker"
   - Make it **Private** (recommended for personal finance data)
   - Click "Create repository"

3. **Push your code** (using Git)
   ```bash
   cd path/to/family-finance-tracker
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/family-finance-tracker.git
   git push -u origin main
   ```

   **Don't have Git?**
   - Download from [git-scm.com](https://git-scm.com/)
   - Or use GitHub Desktop: [desktop.github.com](https://desktop.github.com/)

### Step 2: Deploy to Vercel

1. **Create a Vercel account**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up"
   - Sign up with your GitHub account

2. **Import your project**
   - Click "Add New..." → "Project"
   - Select your `family-finance-tracker` repository
   - Click "Import"

3. **Configure the project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (should be pre-filled)
   - **Output Directory**: `dist` (should be pre-filled)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable from your `.env` file:
     ```
     VITE_FIREBASE_API_KEY = your_api_key
     VITE_FIREBASE_AUTH_DOMAIN = your_domain
     VITE_FIREBASE_PROJECT_ID = your_project_id
     VITE_FIREBASE_STORAGE_BUCKET = your_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
     VITE_FIREBASE_APP_ID = your_app_id
     VITE_FIREBASE_MEASUREMENT_ID = your_measurement_id
     ```
   - Make sure to add them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - You'll get a URL like `https://family-finance-tracker.vercel.app`

### Step 3: Configure Firebase for Production

1. **Add your Vercel domain to Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to "Authentication" → "Settings" → "Authorized domains"
   - Click "Add domain"
   - Add your Vercel URL (e.g., `family-finance-tracker.vercel.app`)
   - Click "Add"

2. **Update Firestore Rules for Production**
   - Go to "Firestore Database" → "Rules"
   - Make sure your rules are secure (see SETUP_GUIDE.md Step 6)
   - Click "Publish"

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Try signing up with a new account
3. Add some transactions
4. Check that everything works

### Step 5: Set Up Custom Domain (Optional)

1. **Buy a domain** (optional)
   - Use services like Namecheap, Google Domains, or GoDaddy
   - Example: `myfinancetracker.com`

2. **Add to Vercel**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

---

## Option 2: Deploy to Firebase Hosting

Firebase Hosting is another great option since you're already using Firebase.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

- Select your Firebase project
- Set public directory to: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (or Yes if you want)

### Step 4: Build Your App

```bash
npm run build
```

### Step 5: Deploy

```bash
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## Option 3: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables (same as Vercel)
7. Click "Deploy"

---

## 🔒 Security Best Practices

### 1. Environment Variables
- **Never commit `.env` file to Git**
- Add `.env` to `.gitignore` (already done)
- Use platform-specific environment variables

### 2. Firebase Security Rules
- Always use authentication checks
- Never allow public read/write access
- Test your rules before deploying

### 3. API Keys
- Firebase API keys are safe to expose in frontend code
- They're restricted by Firebase security rules
- Still, keep them in environment variables for easy management

### 4. HTTPS
- All deployment platforms provide HTTPS by default
- Never use HTTP for production

---

## 📊 Monitoring Your App

### Vercel Analytics (Free)
1. Go to your project in Vercel
2. Click "Analytics"
3. Enable Web Analytics
4. See visitor stats and performance

### Firebase Analytics
1. Enable Analytics in Firebase Console
2. Add the measurement ID to your app
3. Track user behavior and app usage

---

## 🔄 Updating Your Deployed App

### For Vercel:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel automatically rebuilds and deploys!

### For Firebase Hosting:
1. Make changes locally
2. Build the app: `npm run build`
3. Deploy: `firebase deploy --only hosting`

---

## 🆘 Troubleshooting Deployment

### Build Fails
- Check that all dependencies are in `package.json`
- Make sure `npm run build` works locally
- Check build logs for specific errors

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check that values don't have quotes or extra spaces

### Firebase Auth Not Working
- Add your deployment domain to Firebase authorized domains
- Check that Firebase config is correct
- Verify environment variables are set

### App Shows Blank Page
- Check browser console for errors (F12)
- Verify build output directory is correct (`dist`)
- Make sure all routes are configured for SPA

---

## 💰 Cost Considerations

### Free Tier Limits

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited projects
- Perfect for personal use

**Firebase Free (Spark Plan):**
- 10 GB storage
- 50,000 reads/day
- 20,000 writes/day
- More than enough for personal/family use

**Netlify Free:**
- 100 GB bandwidth/month
- 300 build minutes/month

### When to Upgrade
- If you exceed free tier limits
- If you need more team members
- If you want advanced features

---

## 🎉 You're Live!

Congratulations! Your Family Finance Tracker is now accessible from anywhere in the world!

### Share with Family
- Send them your app URL
- They can create their own accounts
- (Family sharing feature coming soon!)

### Next Steps
- Set up a custom domain
- Enable analytics
- Add more features
- Share with friends!

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)

---

**Happy Deploying! 🚀**
