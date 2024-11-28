# User Authentication and Admin Management System

## Project Overview
This project implements a robust authentication and user management system with Express.js, featuring secure routes for user registration, login, logout, and admin-specific user management.

## Prerequisites
- Node.js (v14+ recommended)
- npm

## Installation

### Backend Setup
1. Clone the repository
```bash
git clone <your-repository-url>
cd your-project-directory/backend
```

2. Install backend dependencies
```bash
npm install
```

### Frontend Setup
```bash
cd ../client
npm install
```

## Environment Configuration
Create a `.env` file in the backend directory with the following variables:
- `PORT`: Server port (e.g., 5000)
- `JWT_SECRET`: Secret key for JSON Web Token
- `MONGODB_URI`: Your MongoDB connection string

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```

### Start Frontend Development Server
```bash
cd client
npm run dev
```

## Authentication Routes

### Public Routes
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout

### Protected Routes
- `GET /api/auth/CheckUser`: Verify current user authentication

## Admin Routes (Admin Access Only)
- `GET /api/admin/getuser`: Retrieve all users
- `POST /api/admin/adduser`: Create new user
- `PUT /api/admin/update-role/:userId`: Update user role
- `DELETE /api/admin/delete/:id`: Delete user

## Middleware
- `IsUser`: Verifies user authentication for protected routes
- `isAdmin`: Ensures only admin users can access admin-specific routes

## Security Features
- JWT-based authentication
- Role-based access control
- Secure route protection
- User authentication verification

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
[Specify your project's license]
