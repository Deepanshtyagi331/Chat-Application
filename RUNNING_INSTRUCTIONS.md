# Connectify - Running Instructions

This document provides step-by-step instructions for setting up and running the Connectify application in development mode.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v16 or higher) - https://nodejs.org/
2. **MongoDB** (v4.4 or higher) - https://www.mongodb.com/try/download/community
3. **Git** - https://git-scm.com/
4. **Code Editor** (e.g., VS Code) - https://code.visualstudio.com/

## Setup Instructions

### 1. Clone the Repository

Open your terminal or command prompt and navigate to the directory where you want to clone the project:

```bash
git clone <repository-url>
cd connectify
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/connectify
JWT_SECRET=connectify_jwt_secret_key_2025
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=connectify_refresh_token_secret_2025
REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Note:** For development, you can leave the Cloudinary variables as placeholders unless you plan to test file uploads.

### 4. Start MongoDB

Make sure MongoDB is running on your system. You can start it with:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

If MongoDB isn't installed, download and install it from https://www.mongodb.com/try/download/community

### 5. Frontend Setup

Open a new terminal window/tab, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

In the backend terminal:

```bash
cd backend
npm run dev
```

This will start the Node.js server on port 5000 with nodemon for auto-reloading on code changes.

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

### 2. Start the Frontend Development Server

In the frontend terminal:

```bash
cd frontend
npm run dev
```

This will start the Vite development server on port 3000.

**Expected Output:**
```
  VITE v4.4.9  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 3. Access the Application

Open your web browser and navigate to:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Testing the Application

### 1. User Registration

1. Open http://localhost:3000 in your browser
2. Click "create a new account"
3. Fill in the registration form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Create account"

### 2. User Login

1. After registration, you'll be redirected to the chat interface
2. To test login separately:
   - Go to http://localhost:3000/login
   - Enter your credentials
   - Click "Sign in"

### 3. Chat Features

1. **Create a Chat:**
   - Use the search bar in the sidebar to find another user
   - Click on a user to start a chat

2. **Send Messages:**
   - Type in the message input field
   - Press Enter or click the send button

3. **Test Real-time Features:**
   - Open the application in two different browsers or incognito windows
   - Log in with different accounts
   - Send messages between accounts to test real-time delivery

### 4. Voice/Video Calls

1. **Initiate a Call:**
   - Open a chat with another user
   - Click the phone (voice) or video (video) icon

2. **Answer a Call:**
   - When receiving a call, click "Accept" in the call notification

**Note:** For full call functionality, both users need to grant camera/microphone permissions.

## Development Workflow

### Backend Development

1. **Code Structure:**
   - Controllers: `backend/controllers/`
   - Models: `backend/models/`
   - Routes: `backend/routes/`
   - Socket handlers: `backend/socket/`

2. **Auto-reload:**
   - The backend uses nodemon, so changes will automatically restart the server

3. **API Testing:**
   - Use tools like Postman or curl to test API endpoints
   - Base URL: http://localhost:5000/api/

### Frontend Development

1. **Code Structure:**
   - Components: `frontend/src/components/`
   - Pages: `frontend/src/pages/`
   - Context: `frontend/src/context/`
   - Services: `frontend/src/services/`

2. **Hot Reload:**
   - Vite provides hot module replacement, so changes appear instantly in the browser

3. **Component Development:**
   - Create new components in the appropriate directories
   - Import and use components in pages

## Troubleshooting

### Common Issues

1. **Port Already in Use:**
   - Error: "Error: listen EADDRINUSE: address already in use :::5000"
   - Solution: Change the PORT in `.env` file or kill the process using that port

2. **MongoDB Connection Failed:**
   - Error: "Database connection error"
   - Solution: Ensure MongoDB is running and the connection string is correct

3. **CORS Errors:**
   - Error: "Blocked by CORS policy"
   - Solution: Check the CORS configuration in `backend/server.js`

4. **Module Not Found:**
   - Error: "Cannot find module 'xyz'"
   - Solution: Run `npm install` in the respective directory

5. **Permission Issues (WebRTC):**
   - Error: Camera/microphone not working
   - Solution: Ensure browser permissions are granted and using HTTPS (localhost works)

### Debugging Tips

1. **Check Logs:**
   - Backend: View terminal output for server logs
   - Frontend: Check browser console for errors

2. **Network Tab:**
   - Use browser developer tools to inspect API requests

3. **Database:**
   - Use MongoDB Compass or mongo shell to inspect data

4. **Real-time Communication:**
   - Check Socket.IO connection status in browser console

## Useful Commands

### Backend

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install a new dependency
npm install package-name

# Install a development dependency
npm install --save-dev package-name
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install a new dependency
npm install package-name

# Install a development dependency
npm install --save-dev package-name
```

## Next Steps

1. **Explore the Code:**
   - Review the SYSTEM_DESIGN.md for architecture details
   - Check USER_STORIES.md for testing scenarios

2. **Customize:**
   - Modify styles in Tailwind CSS
   - Add new features following the existing patterns

3. **Deploy:**
   - Follow DEPLOYMENT_GUIDE.md for production deployment

4. **Extend:**
   - Add new API endpoints
   - Create additional UI components
   - Implement advanced features like group calls or file encryption

This concludes the running instructions for Connectify. Enjoy building and extending your real-time chat application!