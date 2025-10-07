<<<<<<< HEAD
# Connectify - Real-Time Chat Application

![Connectify Demo](./docs/demo.png)

A full-stack real-time chat application with video and voice calling capabilities built using Node.js, Express.js, Socket.IO, MongoDB, WebRTC, and React.

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication with password hashing
- 💬 **Real-time Messaging** - Instant messaging with Socket.IO
- 👥 **Group Chats** - Create and manage group conversations
- 📞 **Voice Calls** - High-quality audio calls with WebRTC
- 🎥 **Video Calls** - Face-to-face video communication
- 📎 **File Sharing** - Send images, documents, and other files
- 🟢 **Online Status** - Real-time presence indicators
- ✍️ **Typing Indicators** - See when others are typing
- 🔔 **Call Notifications** - Incoming call alerts
- 🌗 **Dark/Light Theme** - Toggle between color schemes
- 🏗️ **Responsive Design** - Works on all device sizes

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - NoSQL database with Mongoose
- **JWT** - Authentication and authorization
- **Bcrypt.js** - Password hashing
- **Multer/Cloudinary** - File upload handling

### Frontend
- **React** - JavaScript library for UI
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **WebRTC** - Browser APIs for real-time communication
- **Vite** - Build tool and development server

## System Architecture

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

## Folder Structure

```
connectify/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── socket/          # Socket.IO handlers
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Images, icons
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API and utility services
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.js   # Vite configuration
├── docs/                # Documentation files
├── SYSTEM_DESIGN.md     # System architecture documentation
├── USER_STORIES.md      # User stories for testing
├── DEPLOYMENT_GUIDE.md  # Deployment instructions
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd connectify
   ```

2. **Backend setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/connectify
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Application

1. **Start MongoDB** (if running locally)

2. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Documentation

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

## WebRTC Implementation

### Call Flow
1. Caller creates offer and sends via Socket.IO
2. Receiver receives offer and creates answer
3. Answer sent back via Socket.IO
4. Both exchange ICE candidates
5. Media streams flow directly between peers

### Signaling Events
- `outgoing-call` - Initiate call
- `incoming-call` - Receive call
- `answer-call` - Accept call
- `reject-call` - Reject call
- `end-call` - Terminate call
- `ice-candidate` - Exchange network information

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  avatar: String,
  status: String,
  lastSeen: Date,
  isVerified: Boolean
}
```

### Chat
```javascript
{
  chatName: String,
  isGroupChat: Boolean,
  users: [ObjectId],
  latestMessage: ObjectId,
  groupAdmin: ObjectId,
  avatar: String
}
```

### Message
```javascript
{
  sender: ObjectId,
  content: String,
  chat: ObjectId,
  readBy: [ObjectId],
  messageType: String,
  fileUrl: String,
  fileName: String
}
```

### Call
```javascript
{
  caller: ObjectId,
  receiver: ObjectId,
  chat: ObjectId,
  callType: String,
  callStatus: String,
  duration: Number,
  startTime: Date,
  endTime: Date
}
```

## Testing

### User Stories
Refer to [USER_STORIES.md](USER_STORIES.md) for comprehensive testing scenarios.

### Manual Testing
1. User registration and login
2. One-to-one messaging
3. Group chat creation and messaging
4. File and image sharing
5. Voice and video calls
6. Online/offline status updates
7. Typing indicators
8. Message read receipts
9. Theme switching
10. Responsive design on different devices

## Deployment

Refer to [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy
1. **Backend (Render):**
   - Create web service
   - Set environment variables
   - Deploy from repository

2. **Frontend (Vercel):**
   - Import project
   - Set environment variables
   - Deploy

## Security Considerations

- JWT tokens with refresh token rotation
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- HTTPS in production
- Secure file uploads

## Performance Optimizations

- Database indexing
- Connection pooling
- Pagination for chat history
- Lazy loading components
- Code splitting
- CDN for static assets

## Future Enhancements

- 🔐 End-to-end encryption
- 📱 Mobile app (React Native)
- 🖥️ Desktop app (Electron)
- 📺 Screen sharing
- 🎚️ Group video calls
- 📊 Analytics dashboard
- 🤖 AI chatbots
- 🎵 Voice messages
- 📍 Location sharing
- 🎲 Games and integrations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [WebRTC](https://webrtc.org/) for peer-to-peer communication
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [MongoDB](https://www.mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for media management

## Support

For support, email [tyagideepansh60@gmail.com](mailto:tyagideepansh60@gmail.com) or open an issue in the repository.

---

**Connectify** - Stay connected, stay real.
=======
# Chat Application
A full-stack real-time chat application built with Node.js, WebRTC, and Socket.IO — featuring instant messaging, voice & video calls, and modern UI.
>>>>>>> 87a765c315db37d7fac1f48fdd66ea78e714fa01
