# Task 3 – Authentication & Security

This folder documents the authentication layer used across the stack.

## Features
- User registration + login (`/api/auth/register`, `/api/auth/login`)
- Forgot/reset password flow
- Password hashing with `bcryptjs`
- JWT creation, storage, and validation

## Key Files
- `backend/routes/auth.js`
- `backend/models/User.js`
- `backend/middleware/auth.js`
- `frontend/src/components/Auth.js`
- `frontend/src/utils/auth.js`

## Flow Summary
1. User submits email + password
2. Server validates + hashes password (`bcryptjs`, 10 rounds)
3. JWT issued (`7d` expiry) and returned to client
4. Client stores token (localStorage) and attaches `Authorization: Bearer <token>` header
5. Protected routes verify token via middleware

## Commands
Use the same backend startup steps as Task 2; authentication is part of the same Express app.

