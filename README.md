# Social Backend API

This is a **Node.js backend** for a social media platform with features like user registration, authentication, posts, and friend management. It uses **Express.js**, **Knex.js (MySQL)**, **Redis caching**, **JWT authentication**, and **Nodemailer** for email notifications.

---

## 🚀 Features

- **User Management**
  - Signup & Login
  - Profile update
  - Password reset via email
  - JWT authentication
- **Posts**
  - Create new posts (caption + image)
  - View all posts with user info
  - Delete posts
  - Redis caching for faster retrieval
- **Friend Management**
  - Send friend requests
  - Accept, reject, or block requests
  - View friend list
- **Security & Performance**
  - Input validation & error handling
  - Rate limiting
  - Helmet for secure headers
  - CORS configuration
  - Response compression
  - Logging with Morgan

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MySQL (via Knex.js)  
- **Authentication:** JWT tokens  
- **Caching:** Redis  
- **Email Notifications:** Nodemailer (Gmail)  
- **Other Tools:** dotenv, bcrypt, body-parser, cookie-parser, helmet, cors, express-rate-limit, morgan, compression  


