# Task 2 – Backend CRUD API

This folder explains the CRUD API implementation in `backend/routes/tasks.js`.

## Endpoints
| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Fetch authenticated user’s tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Remove a task |

## Key Files
- `backend/server.js`
- `backend/routes/tasks.js`
- `backend/models/Task.js`
- `backend/middleware/auth.js`

## How to Run
```bash
cd backend
npm install
npm run dev
```

MongoDB connection + JWT secrets live in `backend/.env` (generated via `setup-env.js`).

