
# 🚀 Full Stack MERN Project

A full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) with secure authentication, JWT access & refresh tokens, and email support using Nodemailer.

---

## 📦 Tech Stack

### Frontend
- React
- Vite
- Axios
- CSS / Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Access Token & Refresh Token)
- Nodemailer

---

## 📁 Project Structure

```

project-root/
│
├── client/          # Frontend
│
├── server/          # Backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── db/
│   └── server.js
│
└── README.md

````

---

## ⚙️ Prerequisites

Make sure you have installed:
- Node.js (v16 or above)
- npm
- MongoDB (Local or MongoDB Atlas)
- Git

---

## 📥 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
````

---

## 🚀 Frontend Setup (Client)

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🛠 Backend Setup (Server)

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **server** folder.

### `.env.example`

```env
PORT=7000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_token_secret
NODE_MAILER_USER=your_email@gmail.com
NODE_MAILER_PASS=your_email_app_password
```

⚠️ Important:

* Use **Gmail App Password** for `NODE_MAILER_PASS`
* Do NOT commit `.env` to GitHub

---

## ▶️ Run Backend Server

```bash
npm run dev
```

Backend will run on:

```
http://localhost:7000
```

---

## 🔗 Frontend ↔ Backend Connection

Create a `.env` file in the **client** folder:

```env
VITE_BACKEND_URL=http://localhost:7000
```

---

## 🔒 Features

* JWT based authentication
* Access & Refresh tokens
* Secure APIs
* Email based OTP verification
* MongoDB database integration

---

## 🚫 .gitignore

Make sure `.gitignore` contains:

```
node_modules
.env
dist
```

---

## 🧪 Common Issues

* MongoDB not connecting → Check `MONGODB_URI`
* Token errors → Verify JWT secrets
* Email not sending → Check Gmail App Password
* CORS issue → Verify backend CORS config

---

## 📌 Run Project Locally (Quick Commands)

```bash
# Start frontend
cd client
npm run dev

# Start backend
cd server
npm run dev
```

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nikunj Bisani**
Full Stack Developer | MERN | Java | DSA

