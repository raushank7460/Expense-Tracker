# SpendFlow — Modern MERN Stack Expense Tracker & Financial Analytics Web Application
#Good
A full-stack, responsive, SaaS-grade **Expense Tracker Web Application** built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. Features secure JWT authentication, expense and income management, category budgets with real-time progress & threshold alerts, interactive analytics powered by Recharts, custom categories, CSV/Print reports, Dark & Light modes, and multi-currency support.

---

## 📸 Key Features

- **🏠 Modern SaaS Landing Page**: Interactive marketing homepage with feature previews, live mockup card, benefits, testimonials, and direct CTAs.
- **🔐 User Authentication**:
  - Secure registration with Full Name, Email, Password, and Confirm Password.
  - JWT token generation & verification with 30-day persistence in `localStorage`.
  - Password hashing with `bcryptjs`.
  - Protected API routes & frontend routes with automatic token attachment and 401 session expiry handling.
- **📊 Interactive Dashboard**:
  - Summary KPI cards (Total Balance, Total Income, Total Expenses, Savings Rate).
  - Income vs Expense monthly trend chart (switchable between Bar and Area views).
  - Category breakdown donut chart with live center totals.
  - Real-time monthly budget progress widget.
  - Recent transactions list with quick action triggers.
- **💳 Expense Management**:
  - Full CRUD (Create, Read, Update, Delete).
  - Search with debounce, Category filter, Payment Method filter, Date Range filter, and Multi-column sorting.
  - Detailed metadata: Title, Amount, Category, Date, Payment Method (Cash, UPI, Credit Card, Debit Card, Bank Transfer, Other), Description.
- **💰 Income Management**:
  - Full CRUD for income records (Salary, Freelancing, Business, Investment, Dividends, etc.).
  - Search, source filter, date range filter, and pagination.
- **📑 Unified Transactions Ledger**:
  - Combined ledger of all incomes and expenses with color-coded badges.
  - Full-text search and multi-criteria filters.
  - **One-Click CSV Export** (`.csv` file download).
  - **Print Financial Report** view.
- **🎯 Smart Budget Management**:
  - Category-wise monthly budget targets with month & year selectors.
  - Real-time spent vs remaining calculations.
  - Visual status alerts:
    - 🟢 **Safe** (<75% spent)
    - 🟡 **Warning** (75%–99% spent)
    - 🔴 **Exceeded** (≥100% spent)
- **🏷️ Custom Categories**:
  - Default category setup on registration (Food, Shopping, Transportation, Bills, Entertainment, Healthcare, Education, Travel, Other).
  - Custom category builder with icon selector and color palette picker.
  - Safe deletion check preventing deletion of categories linked to active transactions.
- **📈 Advanced Reports & Analytics**:
  - Period selector: *Today*, *This Week*, *This Month*, *This Year*, *Custom Date Range*.
  - Rolling 12-month cash flow graphs.
  - Smart Financial Insights (Daily average spend, top category impact, spending ratio alerts).
- **👤 Profile & Settings**:
  - Update user name and avatar (URL or quick preset selector).
  - Secure Change Password form.
  - Multi-Currency switcher (`₹ INR`, `$ USD`, `€ EUR`, `£ GBP`, `CA$ CAD`, `AU$ AUD`, `¥ JPY`, `CN¥ CNY`).
  - Dark Mode & Light Mode toggle with instant theme transition.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v7
- **Styling**: Vanilla Tailwind CSS + Glassmorphism utilities + Custom animations
- **Charts**: Recharts (ResponsiveContainer, BarChart, AreaChart, PieChart)
- **Icons**: React Icons (Heroicons 2, Material Icons)
- **HTTP Client**: Axios (with centralized JWT interceptor)
- **State Management**: React Context API (`AuthContext`, `ThemeContext`, `CurrencyContext`, `ToastContext`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation**: `validator` & Mongoose schema validations
- **Logging & CORS**: `morgan`, `cors`, `dotenv`

---

## 📁 Project Structure

```
Expense-Tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile, Password
│   │   ├── expenseController.js  # Expense CRUD, filters, pagination
│   │   ├── incomeController.js   # Income CRUD, filters, pagination
│   │   ├── transactionController.js # Unified ledger & CSV export
│   │   ├── budgetController.js   # Monthly budgets & progress calc
│   │   ├── categoryController.js # Custom categories & safe delete
│   │   └── analyticsController.js # KPIs, charts & insights
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & req.user attachment
│   │   └── errorMiddleware.js    # 404 & Central error handler
│   ├── models/
│   │   ├── User.js               # User schema & bcrypt hashing
│   │   ├── Expense.js            # Expense schema
│   │   ├── Income.js             # Income schema
│   │   ├── Budget.js             # Budget schema
│   │   └── Category.js           # Category schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   └── generateToken.js      # JWT token sign utility
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Button, Input, Modal, ConfirmationModal, StatCard, Badge, EmptyState, Pagination, SkeletonLoader, CategoryIcon
│   │   │   ├── layout/           # Navbar, Sidebar, AppLayout
│   │   │   ├── dashboard/        # IncomeVsExpenseChart, CategoryPieChart, BudgetProgressWidget, RecentTransactions
│   │   │   ├── expenses/         # ExpenseModal
│   │   │   ├── income/           # IncomeModal
│   │   │   ├── budgets/          # BudgetModal
│   │   │   └── categories/       # CategoryModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── CurrencyContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Public SaaS Homepage
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── ExpensesPage.jsx
│   │   │   ├── IncomePage.jsx
│   │   │   ├── BudgetsPage.jsx
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/             # Axios API service modules
│   │   ├── utils/                # Date/currency formatters, CSV export & print
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json                  # Root runner scripts
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+` or `v22+` installed
- **MongoDB**: Local MongoDB community server running (`mongodb://127.0.0.1:27017`) OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection URI.

### 2. Clone / Open the Repository
```bash
cd Expense-Tracker
```

### 3. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in `backend/` (or copy `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_2025
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm start
   # or with nodemon for live reload:
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

### 4. Frontend Setup
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Configure frontend environment variables:
   Create a `.env` file in `frontend/` (or copy `.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with full name, email, password | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/profile` | Get current user's profile information | Private (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update name, profile picture, or default currency | Private (Bearer Token) |
| `PUT` | `/api/auth/change-password` | Update account password | Private (Bearer Token) |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/expenses` | Create a new expense | Private |
| `GET` | `/api/expenses` | Get expenses with filters (`search`, `category`, `paymentMethod`, `startDate`, `endDate`, `sortBy`, `page`, `limit`) | Private |
| `GET` | `/api/expenses/:id` | Get single expense details | Private |
| `PUT` | `/api/expenses/:id` | Update an existing expense | Private |
| `DELETE` | `/api/expenses/:id` | Delete an expense | Private |

### Income (`/api/income`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/income` | Record a new income entry | Private |
| `GET` | `/api/income` | Get income list with filters & pagination | Private |
| `GET` | `/api/income/:id` | Get single income record | Private |
| `PUT` | `/api/income/:id` | Update an income record | Private |
| `DELETE` | `/api/income/:id` | Delete an income record | Private |

### Unified Transactions (`/api/transactions`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/transactions` | Unified income & expense ledger with search, category, type (`all`, `income`, `expense`), and sorting | Private |
| `GET` | `/api/transactions/export` | Export full unpaginated transaction history for CSV download | Private |

### Budgets (`/api/budgets`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/budgets` | Set or update monthly category budget | Private |
| `GET` | `/api/budgets` | Get all budgets for month & year with dynamically computed spent amount, remaining amount, and percentage | Private |
| `PUT` | `/api/budgets/:id` | Update budget amount | Private |
| `DELETE` | `/api/budgets/:id` | Delete budget target | Private |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/categories` | Get all default and custom categories for user | Private |
| `POST` | `/api/categories` | Create custom category with icon and hex color | Private |
| `PUT` | `/api/categories/:id` | Update category (cascades name change) | Private |
| `DELETE` | `/api/categories/:id` | Safe delete category (checks if in use) | Private |

### Analytics & Reports (`/api/analytics`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics/summary` | Top-level KPIs (Total Balance, Income, Expenses, Savings Rate, Top Category) | Private |
| `GET` | `/api/analytics/monthly` | Rolling 12-month income vs expenses trend | Private |
| `GET` | `/api/analytics/category` | Category distribution & percentages | Private |
| `GET` | `/api/analytics/insights` | Smart spending health insights & daily averages | Private |

---

## 🌐 Production Deployment Guide

### Backend (Render / Railway / Heroku)
1. Push your code to a GitHub repository.
2. In [Render](https://render.com) or [Railway](https://railway.app), create a new **Web Service**.
3. Set the Root Directory to `backend`.
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGO_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority`
   - `JWT_SECRET` = `<your-secure-random-key>`
   - `CLIENT_URL` = `https://your-frontend-domain.vercel.app`

### Frontend (Vercel / Netlify)
1. In [Vercel](https://vercel.com) or [Netlify](https://netlify.com), import your GitHub repository.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
7. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the **MIT License**.
