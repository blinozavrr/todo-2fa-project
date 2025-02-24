
# ToDoList with Two-Factor Authentication (2FA)

## Table of Contents
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

---

## 1. Overview
This is a **ToDo List** application featuring **Two-Factor Authentication** (2FA) via Google Authenticator, user roles (*user* and *admin*), and a basic CRUD interface for tasks.

Key points:
- **Users** can register, enable 2FA, and manage their own tasks.  
- **Admins** can view tasks for all users, create tasks for any user, and change user roles.

---

## 2. Features

**(1) Registration**  
Generates a 2FA secret and a QR code. Users scan the QR code, then confirm a 6-digit TOTP code to enable 2FA.

**(2) Login**  
Requires email/password. If 2FA is enabled, also requires a TOTP code.

**(3) Task Management (CRUD)**  
- Regular users (role `user`) manage only their own tasks.  
- `admin` can view/manage tasks for all users.

**(4) User Profile**  
- Update email/password, etc.  
- `admin` can promote/demote other users to/from `admin`.

**(5) Security**  
- Passwords hashed with **bcrypt**.  
- **JWT** for authentication (middleware).  
- **speakeasy** (TOTP) and **qrcode** (generate QR).

---

## 3. Technologies
- **Node.js + Express.js** (backend)  
- **MongoDB** (e.g., MongoDB Atlas)  
- **JWT** (jsonwebtoken)  
- **bcrypt** (password hashing)  
- **speakeasy + qrcode** (2FA)  
- **React** (Material UI) for the frontend

---

## 4. Project Structure
```
todo-2fa-project/
  ├─ client/   (React app)
  │   ├─ public/
  │   ├─ src/
  │   └─ package.json
  ├─ server/   (Express backend)
  │   ├─ config/db.js
  │   ├─ controllers/
  │   ├─ middlewares/
  │   ├─ models/
  │   ├─ routes/
  │   ├─ server.js
  │   └─ package.json
  ├─ package.json (optional if combining)
  └─ README.md
```
- **client**: React (pages, components)  
- **server**: Node/Express (routes, controllers, models)  
- Optionally, a root `package.json` for a monolithic setup.

---

## 5. Installation & Local Setup

### 5.1. Environment Variables
1. Clone the repository:  
   `git clone https://github.com/username/todo-2fa-project.git`

2. In the **server** folder, create a file called `.env` (do not commit to public repos). Example:
```
PORT=4000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```
3. (Optional) If the frontend needs environment variables, set them in `.env` or `.env.development` inside `client`.

### 5.2. Running the App

**Option A: Separate (Dev)**  
- **Backend**:  
  1) `cd server`  
  2) `npm install`  
  3) `npm run dev`  
  This starts on [http://localhost:4000](http://localhost:4000).

- **Frontend**:  
  1) `cd ../client`  
  2) `npm install`  
  3) `npm start`  
  This runs on [http://localhost:3000](http://localhost:3000).

**Option B: Monolithic**  
1. At the project root, if you have a `package.json`, add scripts like:
```
"scripts": {
  "postinstall": "npm install --prefix client && npm run build --prefix client && npm install --prefix server",
  "start": "node server/server.js"
}
```
2. Make sure `server.js` serves `../client/build`.  
3. Then do:
```
npm install
npm run postinstall
npm start
```
4. Access via [http://localhost:4000](http://localhost:4000).

---

## 6. API Endpoints
Below assume a prefix `/api`.

**Authentication**  
- `POST /api/auth/register`: Creates a user, returns a QR code (2FA) and userId.  
- `POST /api/auth/verify-2fa`: Confirms the 6-digit TOTP code, enables 2FA.  
- `POST /api/auth/login`: Requires email/password, plus TOTP if 2FA. Returns JWT.

**Users (private)**  
- `GET /api/users/profile`: Returns your (logged-in) profile.  
- `PUT /api/users/profile`: Updates email/password for the logged-in user.  
- `GET /api/users` (admin): Lists all users.  
- `PUT /api/users/:userId` (admin): Change user’s role (e.g. `admin`).

**Tasks (private)**  
- `POST /api/tasks`: Creates a task. If admin, can set `ownerId`; otherwise user sets only themselves.  
- `GET /api/tasks`: Users see only their tasks; admin sees all tasks or filter by `?owner=<id>`.  
- `GET /api/tasks/:id`: Gets a single task (owner or admin).  
- `PUT /api/tasks/:id`: Update a task (owner or admin).  
- `DELETE /api/tasks/:id`: Delete a task (owner or admin).

---

## 7. Two-Factor Authentication (2FA)
- **Registration**: Server generates a secret (via speakeasy) and a QR code (qrcode).  
- **Verify**: User enters 6-digit TOTP from Google Authenticator. If valid, sets `twoFactorEnabled=true`.  
- **Login**: If 2FA is enabled, user must also provide the TOTP code.

---

## 8. User Roles (RBAC)
- `user`: Can only manage their own tasks.  
- `admin`: Can manage tasks of all users, view all users, change roles, etc.

---

## 9. Deployment (Example on Render)
1. Push your code to GitHub.  
2. On Render:  
   - If separate, deploy React as a Static Site, Node as a Web Service.  
   - Or do a single “monolithic” Web Service.  
3. Set environment variables (MONGO_URI, JWT_SECRET, etc.).  
4. If monolithic, root `package.json` might have:
```
"scripts": {
  "postinstall": "npm install --prefix client && npm run build --prefix client && npm install --prefix server",
  "start": "node server/server.js"
}
```
5. Render will build, then provide a live URL.

https://todo-2fa-project.onrender.com/
