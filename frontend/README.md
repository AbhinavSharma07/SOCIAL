# Social Media Frontend

A beautiful, modern React + Vite frontend for the social media application.

## Features

- 🔐 **Authentication**: Login, Signup, Password Reset
- 👥 **Social Features**: Posts, Friends, User Profiles
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ⚡ **Fast Development**: Vite for lightning-fast hot reload
- 🎨 **Modern UI**: Beautiful components with smooth animations
- 🔄 **State Management**: React Context for global state
- 🌐 **API Integration**: Axios for backend communication

## Tech Stack

- **React 19** - UI Library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Heroicons** - Beautiful SVG icons
- **Lucide React** - Additional icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 3000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Navbar, Layout)
│   ├── Posts/          # Post-related components
│   └── UI/             # Generic UI components
├── context/            # React Context providers
├── pages/              # Page components
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.jsx             # Main App component
└── main.jsx            # Entry point
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /fb/signup` - User registration
- `POST /fb/login` - User login
- `POST /fb/forgotpassword` - Password reset request
- `POST /fb/reset` - Password reset confirmation

### User Management
- `GET /fb/user/:username` - Get user profile
- `PUT /fb/editprofile` - Update user profile

### Posts
- `GET /fb/home` - Get all posts
- `POST /fb/newpost` - Create new post
- `DELETE /fb/deletePost/:post_id` - Delete post

### Friends
- `POST /fb/sendReq/:fId` - Send friend request
- `POST /fb/:Action/:fId` - Respond to friend request
- `GET /fb/friendlist` - Get friend list

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/fb
```

## Features Overview

### Authentication
- Secure login/signup with form validation
- Password visibility toggle
- Remember me functionality
- Password reset flow

### Social Feed
- Create and view posts
- Image support via URL
- Like and comment functionality (UI ready)
- Real-time updates

### User Profiles
- View and edit profile information
- Avatar generation
- Personal information management

### Friends System
- Send friend requests
- Accept/reject requests
- View friend list
- Search functionality

## Styling

The application uses Tailwind CSS with custom configurations:

- **Custom Colors**: Social media themed color palette
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first responsive design
- **Components**: Reusable component classes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.