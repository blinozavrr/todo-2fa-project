ToDoList with Two-Factor Authentication (2FA)

Table of Contents
1. Overview
2. Features
3. Technologies
4. Project Structure
5. Installation & Local Setup
   - Environment Variables
   - Running the App
6. API Endpoints
7. Two-Factor Authentication (2FA)
8. User Roles (RBAC)
9. Deployment (Example on Render)
10. License

Overview
This is a ToDo Listapplication featuring Two-Factor Authentication (2FA)via Google Authenticator, user roles (userand admin), and a basic CRUD interface for tasks.
Key points:
- Userscan register, enable 2FA, and manage their own tasks.
- Adminscan view tasks for all users, create tasks for any user, and change user roles.
Features
1. Registration
   - Generates a 2FA secret and a QR code for Google Authenticator.
   - Users scan the QR code, then confirm a 6-digit TOTP code to enable 2FA.
2. Login
   - Requires email/password.
   - If 2FA is enabled, also requires a TOTP code.
3. Task Management (CRUD)
   - Regular users (userrole) can manage only their own tasks.
   - adminrole can view & manage tasks for all users.
4. User Profile
   - Update email/password, etc.
   - Admins can promote/demote other users to/from admin.
5. Security
   - Passwords hashed with bcrypt.
   - JWTfor authentication (with middleware).
   - speakeasyfor 2FA, qrcodefor generating QR codes.
Technologies
- Node.js + Express.js(backend)
- MongoDB(e.g., MongoDB Atlas)
- JWT(jsonwebtoken) for token-based auth
- bcryptfor hashing passwords
- speakeasy+ qrcodefor 2FA
- React(Material UI) for the frontend
Project Structure

```
todo-2fa-project/
  â”œâ”€ client/
  â”‚   â”œâ”€ public/
  â”‚   â”œâ”€ src/
  â”‚   â””â”€ package.json
  â”œâ”€ server/
  â”‚   â”œâ”€ config/db.js
  â”‚   â”œâ”€ controllers/
  â”‚   â”œâ”€ middlewares/
  â”‚   â”œâ”€ models/
  â”‚   â”œâ”€ routes/
  â”‚   â”œâ”€ server.js
  â”‚   â””â”€ package.json
  â”œâ”€ package.json
  â””â”€ README.md
```

- client: React (pages, components, etc.)
- server: Node/Express (routes, controllers, models)
- Optional: root-level package.jsonfor monolithic build.
Installation & Local Setup
Environment Variables
1. Clonethe repo:
```
git clone https://github.com/username/todo-2fa-project.git
```
2. In the server folder, create .env:
```
PORT=4000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-for-jwt>
```
3. (Optional) If frontend needs special env, set .env in client.
Running the App
Option A: Separate (Dev)
- Server:
```
cd server
npm install
npm run dev
```
Runs on http://localhost:4000.
- Client:
```
cd ../client
npm install
npm start
```
Runs on http://localhost:3000.
Option B: Monolithic
1. At the root, if package.json is present:
```
"scripts": {
   "postinstall": "npm install --prefix client && npm run build --prefix client && npm install --prefix server",
   "start": "node server/server.js"
}
```
2. Ensure server.js serves ../client/build.
3. Then:
```
npm install
npm run postinstall
npm start
```
4. App at http://localhost:4000.
API Endpoints
(assuming /api/...)
Auth
- POST /api/auth/register
- POST /api/auth/verify-2fa
- POST /api/auth/login
Users (private)
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users (admin)
- PUT /api/users/:userId (admin)
Tasks (private)
- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
Two-Factor Authentication (2FA)
- Registration: Generate secret + QR.
- Verify: 6-digit TOTP => enable 2FA.
- Login: if 2FA on, require TOTP.
User Roles (RBAC)
- user: manages own tasks.
- admin: all tasks, see users, promote roles, etc.
Deployment (Example on Render)
1. Push to GitHub.
2. On Render:
   - Static Site for React only or Web Service for monolithic.
3. Set env vars in Render â†’ Environment.
4. If monolithic, root package.json might have:
```
"scripts": {
  "postinstall": "npm install --prefix client && npm run build --prefix client && npm install --prefix server",
  "start": "node server/server.js"
}
```
5. Render builds & gives a live URL.
License
```
MIT License
Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```
