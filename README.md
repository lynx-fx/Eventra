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
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Email Configuration (Nodemailer)
EMAIL=<your-email@gmail.com>
EMAIL_PASSWORD=<your-app-password>

# Google Auth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Frontend URLs
FRONT_END_LOCAL=http://localhost:3000
FRONT_END_HOSTED=<your-hosted-frontend-url>

# Payment (eSewa)
ESEWA_SECRET_KEY=<your-esewa-secret-key>
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_BASE_URL=https://rc-epay.esewa.com.np
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

**Environment Variables (`client/.env`)**:
Create a `.env` file in the `client` directory:
```env
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_BACKEND_LOCAL=http://localhost:8000
NEXT_PUBLIC_BACKEND_HOSTED=<your-hosted-backend-url>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>

# Payment (eSewa)
NEXT_PUBLIC_ESEWA_SECRET_KEY=<your-esewa-secret-key>
NEXT_PUBLIC_ESEWA_MERCHANT_ID=EPAYTEST
NEXT_PUBLIC_ESEWA_BASE_URL=https://rc-epay.esewa.com.np
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