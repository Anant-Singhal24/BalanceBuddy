# 💰 Balance Buddy

**Balance Buddy** is a sleek and user-friendly **financial management app** designed to help users take control of their finances. Whether it's tracking daily expenses, managing monthly budgets, or planning financial goals, Balance Buddy makes it all simple and insightful. Built using the powerful MERN stack with additional AI-powered financial insights, it's your personal finance companion.

---

## 🚀 Features

- 📊 **Expense Tracking** – Log daily expenses and automatically categorize them.
- 📅 **Budget Management** – Create and manage monthly/weekly budgets with reminders and alerts.
- 🎯 **Financial Goal Setting** – Plan and monitor savings, investments, and other financial goals.
- 📈 **Interactive Dashboards** – Get clear and beautiful charts using `recharts` and `date-fns`.
- 🤖 **AI-Powered Insights** – Get suggestions on spending patterns and budgeting with OpenAI API integration.
- 🔐 **Robust Authentication** – Secure login system using `bcryptjs` for password hashing and `jsonwebtoken` for session management.
- ✉️ **Smart Alerts** – Receive email notifications using `EmailJS` (`@emailjs/nodejs`) for OTP verification and password recovery.

---

## 🏗️ Project Structure

```
BalanceBuddy/
├── Frontend/   # React + Vite-based user interface (TypeScript + TailwindCSS)
└── Backend/    # Node.js + Express API server with MongoDB
```

---

## 🧰 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)

---

## 🔧 Getting Started

### 🖥 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### ⚙️ Backend Setup

```bash
cd Backend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` files in both `Frontend/` and `Backend/` directories.

### 📁 Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

### 📁 Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

# EmailJS Configuration
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
```

---

## 🧠 Tech Stack & Libraries

### Frontend
- ⚛️ React 18 (with Vite)
- 🌐 React Router v6
- 🎨 TailwindCSS
- 📊 Recharts (charts)
- 📅 date-fns (date manipulation)
- 📦 axios for API requests

### Backend
- 🧠 Node.js + Express.js
- 🗃 MongoDB with Mongoose
- 🔒 bcryptjs + jsonwebtoken for secure auth
- 📤 @emailjs/nodejs for reliable email delivery (OTP verification & password reset)
- 🌐 cors and dotenv for configuration
- 🧠 openai for AI-powered financial suggestions

---

## 🤝 Contributing

We welcome your contributions!

1. 🍴 Fork the repo
2. 🚀 Create a branch: `git checkout -b feature/AmazingFeature`
3. 💾 Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. 📤 Push the branch: `git push origin feature/AmazingFeature`
5. 🔁 Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

> Built with 💙 by the Balance Buddy Team — because your money matters.