# Social Media Application

A modern, responsive social media platform built with React, Node.js, and MongoDB. This application provides a rich set of features for social interaction, content sharing, and user engagement.

![Social Media App Screenshot](screenshot.png)

## 🌟 Features

### User Management
- 🔐 Secure Authentication (Login/Register)
- 👤 User Profiles with Avatars
- ✏️ Profile Editing
- 📧 Email Verification

### Social Features
- 👥 Follow/Unfollow Users
- 📱 News Feed
- ❤️ Like Posts
- 💬 Comment on Posts
- 👥 View Followers/Following Lists

### Content Management
- 📝 Create Posts with Text
- 🖼️ Image Upload Support
- 🗑️ Delete Posts
- 📱 Responsive Design
- 🎨 Modern UI/UX

## 🚀 Tech Stack

### Frontend
- React.js
- TailwindCSS
- Axios
- React Router
- React Toastify
- Context API for State Management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for File Upload
- Bcrypt for Password Hashing

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. Start the development servers:

```bash
# Start backend server
cd backend
npm run dev

# Start frontend server in a new terminal
cd frontend
npm start
```

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/logout` - Logout user

### Users
- GET `/api/user/profile/:id` - Get user profile
- PUT `/api/user/profile` - Update user profile
- POST `/api/user/follow/:id` - Follow user
- POST `/api/user/unfollow/:id` - Unfollow user

### Posts
- GET `/api/posts/get-posts` - Get all posts
- POST `/api/posts/create` - Create new post
- DELETE `/api/posts/delete-post/:id` - Delete post
- POST `/api/posts/:id/like` - Like/unlike post
- POST `/api/posts/:id/comment` - Comment on post

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop screens
- 🖥️ Large displays

## 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected Routes
- Input Validation
- File Upload Validation
- XSS Protection

## 🎨 UI Components

- Modern and Clean Interface
- Responsive Navigation
- Interactive Post Cards
- Loading States and Animations
- Toast Notifications
- Modal Dialogs
- Form Validations
- Image Preview
- Infinite Scroll

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [TailwindCSS](https://tailwindcss.com/) for the awesome styling utility classes
- [React Icons](https://react-icons.github.io/react-icons/) for the beautiful icons
- [React Toastify](https://fkhadra.github.io/react-toastify/) for toast notifications
- [Cloudinary](https://cloudinary.com/) for image hosting

## 📞 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/social-media-app](https://github.com/yourusername/social-media-app)

---

⭐️ If you found this project helpful, please give it a star! 