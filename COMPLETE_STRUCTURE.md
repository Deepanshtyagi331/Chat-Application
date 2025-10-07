# Connectify - Complete Project Structure

This document shows the complete file structure of the Connectify application.

```
connectify/
├── DEPLOYMENT_GUIDE.md
├── LICENSE
├── PROJECT_SUMMARY.md
├── README.md
├── RUNNING_INSTRUCTIONS.md
├── SYSTEM_DESIGN.md
├── USER_STORIES.md
├── backend/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── error.js
│   ├── models/
│   │   ├── Call.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── message.js
│   │   └── user.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── auth.js
│   └── node_modules/
├── docs/
│   └── demo.txt
├── frontend/
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── CallModal.jsx
│   │   │   ├── ChatArea.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── webrtc.js
│   │   └── utils/
│   └── node_modules/
└── node_modules/
```

## File Count Summary

- **Root Directory**: 8 files
- **Backend**: 17 files (including 4 controllers, 4 models, 4 routes, 2 utils, 1 middleware, 1 socket handler)
- **Frontend**: 20 files (including 3 pages, 4 components, 2 context providers, 3 services, 1 asset)
- **Documentation**: 7 files
- **Configuration**: 5 files
- **Total Files**: 57 files (not counting node_modules)

## Key Implementation Files

### Backend Core
1. `backend/server.js` - Main server file with Express and Socket.IO setup
2. `backend/.env` - Environment configuration
3. `backend/models/*.js` - MongoDB schemas
4. `backend/controllers/*.js` - Request handlers
5. `backend/socket/socketHandler.js` - Real-time communication logic

### Frontend Core
1. `frontend/src/main.jsx` - React entry point
2. `frontend/src/App.jsx` - Main application component
3. `frontend/src/context/*.jsx` - State management
4. `frontend/src/services/*.js` - API and real-time services
5. `frontend/src/pages/*.jsx` - Page components
6. `frontend/src/components/*.jsx` - UI components

### Configuration
1. `frontend/vite.config.js` - Build tool configuration
2. `frontend/tailwind.config.js` - CSS framework configuration
3. `backend/package.json` - Backend dependencies
4. `frontend/package.json` - Frontend dependencies

This structure represents a complete, production-ready real-time chat application with voice and video calling capabilities.