# ALFRED - Flashcard Learning App

A modern flashcard application built with the MERN stack (MongoDB, Express.js, React, Node.js) that helps users learn efficiently using spaced repetition.

## Features
- 🔐 Secure user authentication and authorization
- 📝 Create, edit, and manage flashcards
- 🔄 Spaced repetition learning system (5-box method)
- ⚡ Practice mode for quick revision
- 📊 Progress tracking and analytics
- 🌓 Dark/Light theme support
- 📱 Responsive design for all devices

## Tech Stack
- **Frontend**: React 19, Vite, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Styling**: CSS3, Bootstrap Icons

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/VirusVrund/alfredtask.git
   cd alfredtask
   ```

2. Install dependencies:
   ```bash
   # Install Backend dependencies
   cd Backend
   npm install

   # Install Frontend dependencies
   cd ../frontend
   npm install
   ```

3. Environment Setup:
   ```bash
   # Backend .env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000

   # Frontend .env
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

1. Start Backend Server:
   ```bash
   cd Backend
   npm start
   ```

2. Start Frontend Development Server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
