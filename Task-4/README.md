# Task 4 – Real-time Chat (Socket.io)

Documentation covering the chat feature built on Socket.io.

## Capabilities
- Real-time bidirectional messaging
- Timestamped chat bubbles
- Visual distinction between sent/received messages
- Auto-scroll to newest message

## Key Files
- `backend/server.js` (Socket.io server + rooms)
- `frontend/src/components/Chat.js`
- `frontend/src/components/Chat.css`

## How It Works
1. Client connects to Socket.io server when `Chat` mounts
2. Server joins the user to the default room
3. Sending a message emits `send-message`; server attaches timestamp + broadcasts
4. Clients listen for `receive-message` and update state immediately

## Test Instructions
```bash
npm run dev          # from repo root
# open http://localhost:3000 in two tabs and chat between them
```

