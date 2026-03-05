# 🌍 TravelVista — Tourism Management System

A full-stack tourism management web application with a **React + Vite** frontend and a **Flask (Python)** backend.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start (One-Click Script)](#-quick-start-one-click-script)
- [Manual Setup](#-manual-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup (Python/Flask)](#2-backend-setup-pythonflask)
  - [3. Frontend Setup (React/Vite)](#3-frontend-setup-reactvite)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)

---

## ✨ Features

- 🏨 Hotel & Transport management
- 📦 Tour package browsing & booking
- ⭐ Reviews & ratings
- 📩 Enquiry system
- 🔐 User authentication with JWT
- 👤 User profile management
- ⚙️ Admin settings & dashboard

---

## 🛠 Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Frontend | React 19, Vite 7, React Router v7 |
| Backend  | Python, Flask,  Flask-JWT-Extended |
| Database | SQLite (auto-created on first run) |
| Styling  | CSS                                |

---

## 📌 Prerequisites

Before you start, make sure the following are installed on your PC:

| Software   | Download Link                          | Verify Command    |
| ---------- | -------------------------------------- | ----------------- |
| **Python**  | https://www.python.org/downloads/      | `python --version` |
| **Node.js** | https://nodejs.org/                    | `node --version`   |
| **Git**     | https://git-scm.com/downloads          | `git --version`    |

> **⚠️ Important (Python):** During Python installation, make sure to check the box that says **"Add Python to PATH"**.

---

## 🚀 Quick Start (One-Click Script)

The easiest way to run this project! A `start.bat` script is included that does **everything automatically**:

### Steps:

1. **Clone the project** (if you haven't already):
   ```bash
   git clone https://github.com/saurabhkhetre/Tourism_managment.git
   cd Tourism_managment
   ```

2. **Double-click** `start.bat`  
   *(Or right-click → "Run as administrator" if Python/Node.js need to be installed)*

### What the script does:

| Step | Action                                       |
| ---- | -------------------------------------------- |
| 1    | ✅ Checks if Python is installed (installs if not) |
| 2    | ✅ Checks if Node.js is installed (installs if not) |
| 3    | ✅ Creates a Python virtual environment       |
| 4    | ✅ Installs Python dependencies (Flask, etc.) |
| 5    | ✅ Installs frontend dependencies (npm)       |
| 6    | 🚀 Opens backend & frontend in separate windows |

Once done, open your browser:

- **Frontend:** http://localhost:5173
- **Backend API:** http://127.0.0.1:5000

---

## 🔧 Manual Setup

If you prefer to set things up step-by-step:

### 1. Clone the Repository

```bash
git clone https://github.com/saurabhkhetre/Tourism_managment.git
cd Tourism_managment
```

---

### 2. Backend Setup (Python/Flask)

Open a terminal and run these commands **one by one**:

```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (Command Prompt):
venv\Scripts\activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

✅ You should see:
```
>> TravelVista API running on http://127.0.0.1:5000
```

> **Keep this terminal open!** The backend needs to stay running.

---

### 3. Frontend Setup (React/Vite)

Open a **second terminal** (keep the backend running) and run:

```bash
# Navigate to the project root (NOT the backend folder)
cd Tourism_managment

# Install frontend dependencies
npm install

# Start the frontend dev server
npm run dev
```

✅ You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser — the app is live! 🎉

---

## 📁 Project Structure

```
Tourism_managment/
├── start.bat              # One-click setup & launch script
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration (includes API proxy)
├── index.html             # HTML entry point
├── public/                # Static assets
├── src/                   # React frontend source code
│   ├── App.jsx            # Main app with routing
│   ├── api.js             # API helper functions
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   └── index.css          # Global styles
├── backend/               # Python backend
│   ├── app.py             # Flask app entry point
│   ├── models.py          # Database models
│   ├── seed.py            # Sample data seeder
│   ├── requirements.txt   # Python dependencies
│   └── routes/            # API route blueprints
│       ├── auth.py
│       ├── packages.py
│       ├── bookings.py
│       ├── reviews.py
│       ├── enquiries.py
│       ├── hotels.py
│       ├── transport.py
│       ├── users.py
│       └── settings.py
```

---

## 🔗 API Endpoints

All API routes are prefixed with `/api`. The Vite dev server automatically proxies `/api` requests to the Flask backend.

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/health`         | Health check          |
| POST   | `/api/auth/login`     | User login            |
| POST   | `/api/auth/register`  | User registration     |
| GET    | `/api/packages`       | List tour packages    |
| GET    | `/api/hotels`         | List hotels           |
| GET    | `/api/transport`      | List transport options |
| GET    | `/api/bookings`       | List bookings         |
| GET    | `/api/reviews`        | List reviews          |
| POST   | `/api/enquiries`      | Submit enquiry        |

---

## 🛑 Stopping the Servers

- Press `Ctrl + C` in each terminal window to stop the servers.
- If you used `start.bat`, close the two terminal windows that opened.

---

## 💡 Troubleshooting

| Problem                             | Solution                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `python` not recognized             | Reinstall Python and check **"Add to PATH"**                             |
| `node` / `npm` not recognized       | Reinstall Node.js from https://nodejs.org/                               |
| Port 5000 already in use            | Close the other app using port 5000, or change the port in `backend/app.py` |
| Port 5173 already in use            | Vite will auto-pick the next available port                              |
| `pip install` fails                 | Make sure you activated the virtual environment first                    |
| Frontend shows network errors       | Make sure the backend is running on port 5000                            |

---

Made with ❤️ for learning and exploration.
