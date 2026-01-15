# Eventra

**Eventra** is a comprehensive full-stack ticket booking platform tailored for the vibrant event scene in Nepal. From concerts in Kathmandu to festivals in Pokhara, Eventra connects attendees with unforgettable experiences.

## 🚀 Features

*   **Modern Landing Page**: A visually stunning, dark-themed landing page with a glassmorphism design.
*   **Nepal-Centric Content**: Curated events and locations specific to Nepal (Kathmandu, Pokhara, Chitwan).
*   **Event Room**: A unique community feature where attendees can share photos and connect with others at the same event.
*   **Smart Navigation**: A responsive navigation bar that adapts and shrinks as you scroll.
*   **User Roles**:
    *   **Users**: Browse events, buy tickets, and share photos.
    *   **Sellers**: Host and manage events.
    *   **Admins**: Oversee platform operations.

## 🛠️ Tech Stack & Dependencies

### Frontend (Client)
Built with **Next.js 16** and **React 19**.
*   **Styling**: `tailwindcss`, `@tailwindcss/vite`
*   **Animations**: `framer-motion`, `lottie-react`
*   **Icons**: `lucide-react`, `react-icons`
*   **Utilities**: `axios`, `js-cookie`, `sonner` (toast notifications)

### Backend (Server)
Built with **Node.js** and **Express**.
*   **Database**: `mongoose` (MongoDB)
*   **Authentication**: `jsonwebtoken` (JWT), `bcryptjs`, `@react-oauth/google`
*   **Security**: `cors`, `helmet`
*   **Email**: `nodemailer`

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js**: v18.17.0 or higher is required.
*   **npm**: v9.0.0 or higher.
*   **MongoDB**: A local instance or a cloud URI (MongoDB Atlas).

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Eventra
```

### 2. Setup Server
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

**Environment Variables (`server/.env`)**:
Create a `.env` file in the `server` directory with the following keys:
```env
PORT=8000
MONGODB_URI_LOCAL=mongodb://localhost:27017/eventra
MONGODB_URI_HOSTED=<your-mongodb-atlas-uri>
JWT_SECRET=<your-long-secret-key>
JWT_TIMEOUT=30d
EMAIL=<your-email>
EMAIL_PASSWORD=<your-app-password>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONT_END_LOCAL=http://localhost:3003
NODE_ENV=development
```

Start the server:
```bash
npm start
# Server runs on http://localhost:8000
```

### 3. Setup Client
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
# Client runs on http://localhost:3000 (default)
```

To run on the custom configured port (3003):
```bash
npm start
# Client runs on http://localhost:3003
```