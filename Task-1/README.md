# Task 1 – React Todo List UI

This folder documents the frontend work for the Todo List experience that lives in `frontend/`.

## Goals
- Create, edit, delete, and complete todos
- Persist todos through API + `localStorage` fallback
- Keep the UI responsive, polished, and accessible

## Key Files
- `frontend/src/components/TodoList.js`
- `frontend/src/components/TodoList.css`
- `frontend/src/App.js`
- `frontend/src/index.css` (global gradients/animation)

## How to Test
```bash
cd frontend
npm install
npm start
```

## Notes
- Uses `useState` + `useEffect` for state and lifecycle
- Axios handles API calls; catches failures and syncs with `localStorage`
- Animations for the global background live in `frontend/src/index.css`

