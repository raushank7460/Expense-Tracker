# 🚀 Vercel Deployment Guide for SpendFlow (Hindi & English)

SpendFlow ko Vercel pe deploy karna bohot aasan hai. Aap seedha GitHub pe code push karke Vercel se 1-Click me deploy kar sakte hain.

---

## 📋 Pre-requisites (Deploy karne se pehle ye tayyar rakhein):
1. **GitHub Account**: Jisme aap ye repository push karenge.
2. **Vercel Account**: [vercel.com](https://vercel.com) (GitHub se sign in karein).
3. **MongoDB Atlas Connection URL**: Free MongoDB cluster link (e.g. `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/spendflow?retryWrites=true&w=majority`).

---

## ⚡ Step-by-Step Deployment Guide

### Step 1: GitHub pe Code Push Karein
Agar aapne abhi tak GitHub pe repo push nahi kiya hai, to VS Code terminal ya command prompt me run karein:
```bash
git add .
git commit -m "feat: setup Vercel deployment, custom logo, footer links, and logout redirect"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

### Step 2: Vercel pe Project Import Karein
1. [vercel.com/dashboard](https://vercel.com/dashboard) pe jayein.
2. **"Add New..."** button pe click karke **"Project"** select karein.
3. Apni GitHub repository **"Expense-Tracker"** / **"SpendFlow"** choose karein aur **"Import"** button dabayein.

---

### Step 3: Environment Variables Configure Karein (Most Important ⭐)
Project settings me **"Environment Variables"** section expand karein aur ye variables add karein:

| Key | Value | Description |
|---|---|---|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster0...` | Aapka MongoDB Atlas connection string |
| `JWT_SECRET` | `spendflow_super_secret_jwt_key_2026` | Random strong secret key |
| `NODE_ENV` | `production` | Production environment flag |
| `CLIENT_URL` | *(Optional)* | Agar alag domain use kar rahe ho to uska URL |

> 💡 **Tip for MongoDB Atlas**: Make sure in MongoDB Atlas -> **Network Access**, IP `0.0.0.0/0` (Allow Access from Anywhere) enabled ho taaki Vercel serverless function MongoDB se connect ho sake.

---

### Step 4: Click "Deploy" 🎉
1. **"Deploy"** button par click karein.
2. 1 se 2 minute me aapka frontend aur backend live ho jayega!
3. Vercel aapko ek live URL dega jaise: `https://your-project.vercel.app`

---

## 🔗 Apne Social Links Kaise Update Karein:
Aap Footer me apne social links asani se update kar sakte hain:
1. File kholein: `frontend/src/components/layout/Footer.jsx`
2. Top pe `SOCIAL_LINKS` object me apne links paste karein:
```javascript
export const SOCIAL_LINKS = {
  github: 'https://github.com/YOUR_ACTUAL_USERNAME',
  linkedin: 'https://linkedin.com/in/YOUR_ACTUAL_USERNAME',
  instagram: 'https://instagram.com/YOUR_ACTUAL_USERNAME',
  twitter: 'https://x.com/YOUR_ACTUAL_USERNAME',
  facebook: 'https://facebook.com/YOUR_ACTUAL_USERNAME',
};
```
3. Save karke Git commit & push karein - Vercel automatically redeploy kar dega!
