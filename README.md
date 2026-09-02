# High-Performance Habit Tracker

A full-stack habit tracking engine designed with a premium UI, dynamic analytics, and strict data persistence. The system categorizes routines into positive/negative reinforcements and visualizes historical data using a custom Codeforces-style annual heatmap.

## Tech Stack
* **Frontend:** React, Recharts, Custom CSS Grids
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Auth:** JWT (HTTP-Only Secure Cookies)

## Local Installation Guide

### Prerequisites
* Node.js installed on your machine
* A MongoDB cluster URI (Atlas or local)

### 1. Configure the Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install


Create a .env file inside the backend folder and add your variables:

Plaintext
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173




Start the server:

Bash
node server.js



2. Configure the Frontend
Open a new terminal window, navigate to the frontend directory, and start the Vite development server:

Bash
cd frontend
npm install
npm run dev


