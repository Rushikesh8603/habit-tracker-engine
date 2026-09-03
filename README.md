# Habit Tracker Engine

A production-grade, full-stack web application designed for high-performance daily tracking. Built with the MERN stack and deployed via a decoupled cloud architecture, this platform tracks positive daily goals alongside zero-target friction habits.

### Live Links
* **Live Application:** [https://habit-tracker-engine.vercel.app](https://habit-tracker-engine.vercel.app)
* **API Endpoint:** [https://habit-tracker-engine.onrender.com](https://habit-tracker-engine.onrender.com)

## Core Features
* **Zero-Target Logic:** Distinct tracking mechanisms for building positive habits (e.g., algorithm practice) and breaking negative friction habits (e.g., social media consumption).
* **Developer-Style Heatmap:** A timezone-proof, Codeforces-style contribution graph that visualizes daily completion streaks and long-term consistency.
* **Decoupled Security Handshake:** Secure, cross-origin communication between the Vercel frontend and Render backend.
* **Global API Routing:** Centralized Axios configuration for streamlined request handling and automated credential injection across the React ecosystem.

## Technical Architecture
* **Frontend:** React, Vite, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose
* **Authentication:** JWT (JSON Web Tokens) via strict `httpOnly`, `secure`, and `sameSite: 'none'` cookies to protect against XSS and CSRF attacks.

## Local Development Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Rushikesh8603/habit-tracker-engine.git
cd habit-tracker-engine
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory:
\`\`\`env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
\`\`\`
Start the server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
\`\`\`bash
cd frontend
npm install
\`\`\`
Create a `.env` file in the `frontend` directory:
\`\`\`env
VITE_API_URL=http://localhost:5001
\`\`\`
Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`

