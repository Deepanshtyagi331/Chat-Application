# Connectify - System Design Documentation

## Overview

Connectify is a full-stack real-time chat application with video and voice calling capabilities. It uses a modern tech stack including Node.js, Express.js, Socket.IO, MongoDB, WebRTC, and React.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │                 │
│ │   WebRTC    │ │    │ │  Socket.IO  │ │    │                 │
│ │   (Calls)   │ │    │ │  (Realtime) │ │    │                 │
│ └─────────────┘ │    │ └─────────────┘ │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for REST API
- **Socket.IO**: Real-time communication library
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Authentication and authorization
- **Bcrypt.js**: Password hashing
- **Multer/Cloudinary**: File upload handling

### Frontend
- **React**: JavaScript library for UI
- **React Router**: Client-side routing
- **Socket.IO Client**: Real-time communication
- **Tailwind CSS**: Utility-first CSS framework
- **WebRTC**: Browser APIs for real-time communication
- **Vite**: Build tool and development server

## Folder Structure

### Backend
```
backend/
├── controllers/          # Request handlers
├── middleware/           # Custom middleware
├── models/               # MongoDB models
├── routes/               # API routes
├── socket/               # Socket.IO handlers
├── utils/                # Utility functions
├── config/               # Configuration files
├── .env                  # Environment variables
└── server.js             # Entry point
```

### Frontend
```
frontend/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom hooks
│   ├── services/         # API and utility services
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

## Database Schema Design

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  avatar: String,
  status: String (online/offline/away/busy),
  lastSeen: Date,
  isVerified: Boolean
}
```

### Chat Model
```javascript
{
  chatName: String,
  isGroupChat: Boolean,
  users: [ObjectId], // References to User
  latestMessage: ObjectId, // Reference to Message
  groupAdmin: ObjectId, // Reference to User (for group chats)
  avatar: String
}
```

### Message Model
```javascript
{
  sender: ObjectId, // Reference to User
  content: String,
  chat: ObjectId, // Reference to Chat
  readBy: [ObjectId], // References to Users
  messageType: String (text/image/file/audio/video),
  fileUrl: String,
  fileName: String
}
```

### Call Model
```javascript
{
  caller: ObjectId, // Reference to User
  receiver: ObjectId, // Reference to User
  chat: ObjectId, // Reference to Chat
  callType: String (audio/video),
  callStatus: String (missed/answered/rejected/ended),
  duration: Number, // in seconds
  startTime: Date,
  endTime: Date
}
```

## Socket.IO Implementation

### Message Delivery
1. Client sends message via REST API
2. Server saves message to database
3. Server emits message to chat room via Socket.IO
4. All clients in room receive real-time message

### Typing Indicators
1. Client emits "typing" event when user types
2. Server broadcasts "user-typing" event to chat room
3. Other clients display typing indicator

### Call Signaling
1. Caller emits "outgoing-call" with offer
2. Server forwards "incoming-call" to receiver
3. Receiver emits "answer-call" with answer
4. Server forwards "call-answered" to caller
5. Both parties exchange ICE candidates
6. Peer-to-peer connection established

### Online/Offline Tracking
1. User connects → emit "join" event
2. Server updates user status to "online"
3. Broadcast "user-status-changed" to all clients
4. User disconnects → update status to "offline"
5. Broadcast status change to all clients

## WebRTC Integration

### Peer Connection Setup
1. Create RTCPeerConnection with ICE servers
2. Get user media (camera/microphone)
3. Add tracks to peer connection
4. Handle ICE candidates exchange via Socket.IO
5. Handle offer/answer exchange via Socket.IO

### Call Flow
1. Caller creates offer and sends via Socket.IO
2. Receiver receives offer and creates answer
3. Answer sent back via Socket.IO
4. Both exchange ICE candidates
5. Media streams flow directly between peers

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/status` - Update user status

### Chats
- `POST /api/chats` - Access/create one-to-one chat
- `GET /api/chats` - Get all user chats
- `POST /api/chats/group` - Create group chat
- `PUT /api/chats/group/rename` - Rename group chat
- `PUT /api/chats/group/add` - Add user to group
- `PUT /api/chats/group/remove` - Remove user from group

### Messages
- `POST /api/messages` - Send new message
- `GET /api/messages/:chatId` - Get all messages in chat
- `PUT /api/messages/:id/read` - Mark message as read

## Security Considerations

1. **Authentication**: JWT tokens with refresh token rotation
2. **Authorization**: Role-based access control
3. **Data Validation**: Input validation on both client and server
4. **Password Security**: Bcrypt hashing with salt
5. **CORS**: Proper CORS configuration
6. **Rate Limiting**: API rate limiting to prevent abuse
7. **HTTPS**: Production deployment with SSL/TLS

## Performance Optimizations

1. **Database Indexing**: Proper indexes on frequently queried fields
2. **Caching**: Redis caching for frequently accessed data
3. **Pagination**: Message pagination for chat history
4. **Lazy Loading**: Components loaded on demand
5. **Code Splitting**: Bundle splitting for faster initial load
6. **Connection Pooling**: Database connection pooling
7. **CDN**: Content delivery network for static assets

## Deployment

### Backend (Render)
- Environment variables configuration
- MongoDB connection string
- JWT secrets
- Cloudinary credentials

### Frontend (Vercel)
- Environment variables for API URLs
- Custom domain configuration
- SSL certificate

## Future Enhancements

1. **Group Calls**: Multi-user WebRTC sessions
2. **Screen Sharing**: Desktop sharing capability
3. **End-to-End Encryption**: Message encryption
4. **Push Notifications**: Mobile push notifications
5. **File Transfer**: Peer-to-peer file sharing
6. **Message Reactions**: Emoji reactions to messages
7. **Chat Bots**: AI-powered chat assistants
8. **Voice Messages**: Audio message recording and playback