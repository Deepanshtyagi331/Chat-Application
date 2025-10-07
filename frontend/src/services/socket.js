import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io(process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' 
  : 'http://localhost:5001', {
  transports: ['websocket'],
  withCredentials: true
});

export default socket;