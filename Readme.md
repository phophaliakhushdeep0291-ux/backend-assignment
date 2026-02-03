# Task Management System (Backend)

A secure, scalable REST API built with Node.js, Express, and MongoDB.

## 🚀 Key Features
- **RBAC (Role-Based Access Control):** Admin vs User roles.
- **Authentication:** JWT with Access/Refresh token rotation.
- **Security:** Bcrypt password hashing and Morgan request logging.
- **Secondary Entity:** Full Task CRUD with ownership protection.
- **Email System:** Built-in email verification and OTP password reset.

## 🛠️ Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Configure your `.env` based on the `.env.sample`.
4. Run `npm run dev` to start the server.

## 📝 Developer Note
The `access.log` file captures all incoming requests. All sensitive data is filtered out from API responses for security.