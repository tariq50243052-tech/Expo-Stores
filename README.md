# Store Management System

A complete MERN stack application for managing inventory across multiple stores.

## Features

- **Admin Dashboard**: Analytics with Recharts.
- **Asset Management**: CRUD assets, Bulk upload via Excel, Export reports.
- **Technician Portal**: Mobile-optimized scanner using `html5-qrcode`.
- **Stores Management**: Manage store locations.
- **Technician Management**: Manage technician accounts.
- **Authentication**: JWT-based auth with Role-Based Access Control (Admin/Technician).

## Setup

### Prerequisites
- Node.js
- MongoDB (running locally on default port 27017)

### Installation

1.  **Clone the repository** (if applicable)
2.  **Install Dependencies**

    ```bash
    # Server
    cd server
    npm install

    # Client
    cd ../client
    npm install
    ```

3.  **Environment Variables**
    
    The server comes with a pre-configured `.env` file:
    ```
    MONGO_URI=mongodb://localhost:27017/expostores
    JWT_SECRET=supersecretkey123
    PORT=5000
    ```

4.  **Database Seeding**
    
    The server automatically seeds the default stores upon the first connection.

### Running the Application

1.  **Start the Backend Server**
    
    ```bash
    cd server
    npm run dev
    ```
    Server runs on `http://localhost:5000`

2.  **Start the Frontend Client**
    
    ```bash
    cd client
    npm run dev
    ```
    Client runs on `http://localhost:5173` (or similar)

## Default Usage

1.  **Create an Admin Account**
    
    Since there is no default admin, you can create one by manually using Postman or by temporarily allowing public registration (not enabled by default). 
    
    *Recommendation*: Use a tool like MongoDB Compass to insert an initial admin user or modify the code temporarily to seed an admin user.
    
    **Seeding Admin User (Optional Script):**
    You can create a `seedAdmin.js` in server root if needed.

    For now, use the API directly or add a script.

    **Quick Fix for First Run:**
    The system doesn't have a registration page (it's an internal tool). 
    You might want to add a temporary seed for an admin user in `server.js` if no users exist.

## Tech Stack

- **MongoDB**: Database
- **Express**: Backend Framework
- **React**: Frontend Library (Vite)
- **Node.js**: Runtime
- **Tailwind CSS**: Styling
- **Recharts**: Charts
- **XLSX**: Excel processing
