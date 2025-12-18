
# Truth vs Noise

A credibility-weighted community platform to evaluate facts, filter misinformation, and amplify truth.

## 📋 Project Overview

Truth vs Noise is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to combat misinformation by implementing a dual voting system:
- **Raw Community Votes** - Popularity-based voting where every vote counts as 1
- **Credibility-Weighted Votes** - Expertise-based voting where votes are weighted by domain credibility

The platform helps users distinguish between what the general population thinks (popularity) and what domain experts believe (truth).

## 🎯 Key Features

### User Authentication & Profiles
- User registration with profession and domain expertise
- JWT-based authentication
- Role-based access control (User/Admin)
- Domain credibility scoring system

### Claim Management
- Submit claims for community evaluation
- Categorize claims by domain (Health, Technology, Politics, Science)
- Attach supporting evidence URLs

### Voting System
- **Dual Voting Mechanism**:
  - Raw Votes: Each vote = 1 point (popularity)
  - Weighted Votes: Votes weighted by user's domain credibility
- Real-time voting results with visual comparisons
- Prevents duplicate voting

### Credibility System
- Base credibility score for all users
- Domain-specific credibility scores
- Cross-domain expertise transfer matrix

### Admin Panel
- User verification and credibility management
- Domain expertise assignment
- System oversight and moderation

## 🏗️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing

### Development Tools
- **Nodemon** - Development server with hot reloading
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
truth-vs-noise/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── ...
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── routes/
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/truth-vs-noise.git
   cd truth-vs-noise
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/truth_vs_noise
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES=7d
   ```

### Running the Application

1. **Start MongoDB** (if using local instance)

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📊 Voting System Explained

### Raw Voting (Popularity-Based)
- Every user vote counts as 1 point
- Shows what the general population believes
- Simple democratic approach

### Weighted Voting (Expertise-Based)
- Votes are weighted by user's domain credibility
- Verified users with domain expertise contribute more
- Helps identify expert consensus vs popular opinion

### Domain Credibility Matrix
Cross-domain expertise transfer:
- Health ↔ Science: 70% transfer
- Technology ↔ Science: 60% transfer
- Politics ↔ Technology: 30% transfer
- And more...

## 👥 User Roles

### Regular Users
- Register and create profiles
- Submit claims for evaluation
- Vote on existing claims
- View voting results and comparisons



## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Protected routes and middleware

## 📈 Future Enhancements

- Real-time voting updates with WebSockets
- Advanced analytics and reporting
- Mobile application development
- Social sharing features
- Enhanced admin dashboard
- Machine learning for credibility scoring





You can save this as `README.md` in your project root directory. This will help anyone who wants to understand, use, or contribute to your Truth vs Noise project.
