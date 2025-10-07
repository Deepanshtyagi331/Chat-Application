# Connectify - Deployment Guide

## Prerequisites

Before deploying Connectify, ensure you have:

1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)
3. **Git** for version control
4. **Accounts with:**
   - Render (for backend deployment)
   - Vercel (for frontend deployment)
   - Cloudinary (for file storage)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd connectify
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

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

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start Development Servers

In one terminal, start the backend:

```bash
cd backend
npm run dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Production Deployment

### Backend Deployment (Render)

1. **Create a Render Account**
   - Go to https://render.com and sign up
   - Connect your GitHub account

2. **Prepare Environment Variables**
   - Create a MongoDB database (you can use MongoDB Atlas)
   - Get your Cloudinary credentials
   - Generate secure JWT secrets

3. **Deploy to Render**
   - Click "New+" → "Web Service"
   - Connect to your repository
   - Set the following:
     - Name: connectify-backend
     - Root Directory: backend
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secure_jwt_secret
     JWT_EXPIRE=30d
     REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret
     REFRESH_TOKEN_EXPIRE=7d
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

4. **Configure Domain (Optional)**
   - Go to "Settings" → "Custom Domains"
   - Add your custom domain
   - Update DNS records as instructed

### Frontend Deployment (Vercel)

1. **Create a Vercel Account**
   - Go to https://vercel.com and sign up
   - Connect your GitHub account

2. **Deploy to Vercel**
   - Click "New Project"
   - Import your repository
   - Set the following:
     - Project Name: connectify-frontend
     - Framework Preset: Vite
     - Root Directory: frontend
   - Override Build Command: `npm run build`
   - Override Output Directory: `dist`

3. **Configure Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-render-backend-url.onrender.com/api
     VITE_SOCKET_URL=https://your-render-backend-url.onrender.com
     ```

4. **Configure Domain (Optional)**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

## Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Select "Shared" tier
   - Choose a cloud provider and region
   - Create cluster (may take a few minutes)

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create a user with read/write permissions

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Add your Render IP address or allow access from anywhere (0.0.0.0/0)

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Cloudinary Setup

1. **Create Cloudinary Account**
   - Go to https://cloudinary.com
   - Sign up for a free account

2. **Get API Credentials**
   - Go to "Dashboard"
   - Note your:
     - Cloud Name
     - API Key
     - API Secret

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret
REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (Vercel Environment Variables)
```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-render-backend-url.onrender.com
```

## Monitoring and Maintenance

### Backend Monitoring
1. **Render Dashboard**
   - Monitor logs in real-time
   - Set up alerts for errors
   - Track resource usage

2. **MongoDB Atlas**
   - Monitor database performance
   - Set up alerts for connection issues
   - Regular backups

### Frontend Monitoring
1. **Vercel Analytics**
   - Track page views and performance
   - Monitor error rates
   - Analyze user engagement

### Regular Maintenance Tasks
1. **Security Updates**
   - Regularly update dependencies
   - Monitor for security vulnerabilities
   - Rotate secrets periodically

2. **Performance Optimization**
   - Monitor response times
   - Optimize database queries
   - Implement caching where appropriate

3. **Backup Strategy**
   - Regular MongoDB backups
   - Monitor storage usage
   - Implement disaster recovery plan

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MongoDB connection string is correct
   - Verify network access rules
   - Ensure backend is running

2. **CORS Errors**
   - Check frontend/backend URLs match
   - Verify CORS configuration in backend
   - Ensure proper headers are set

3. **Authentication Failures**
   - Verify JWT secrets match
   - Check token expiration settings
   - Ensure proper token handling

4. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper multer configuration

### Support

For issues not covered in this guide:
1. Check the application logs
2. Review error messages carefully
3. Consult the official documentation for:
   - Node.js
   - Express.js
   - Socket.IO
   - React
   - MongoDB
   - Render
   - Vercel
4. Reach out to the development team

## Scaling Considerations

### Horizontal Scaling
1. **Backend**
   - Use Render's auto-scaling features
   - Implement load balancing
   - Consider microservices architecture for large scale

2. **Database**
   - Use MongoDB sharding for large datasets
   - Implement read replicas
   - Consider database clustering

### Performance Optimization
1. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use CDN for static assets

2. **Database Optimization**
   - Create proper indexes
   - Optimize queries
   - Implement pagination

3. **Frontend Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization

This deployment guide should help you successfully deploy Connectify to production. Remember to test thoroughly in a staging environment before going live.