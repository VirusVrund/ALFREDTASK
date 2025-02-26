import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './components/Common/PrivateRoute';
import Navbar from './components/Common/Navbar';
import DarkModeToggle from './components/Common/DarkModeToggle';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import CreateFlashcard from './components/Flashcards/CreateFlashcard';
import EditFlashcard from './components/Flashcards/EditFlashcard';
import ReviewSession from './components/Review/ReviewSession';
import Profile from './components/Profile/Profile';
import Settings from './components/Profile/Settings';
import './styles/styles.css';
import AllFlashcards from './components/Flashcards/AllFlashcards';
import PracticeSession from './components/Practice/PracticeSession';
import PredefinedDecks from './components/Practice/PredefinedDecks/index';
import Footer from './components/Common/Footer';
import AIGenerator from './components/AIFlashcards/AIGenerator';
import AIDecks from './components/AIFlashcards/AIDecks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const { auth } = useContext(AuthContext);

  const routes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/dashboard', element: <PrivateRoute component={Dashboard} /> },
    { path: '/all-flashcards', element: <PrivateRoute component={AllFlashcards} /> },
    { path: '/create-flashcard', element: <PrivateRoute component={CreateFlashcard} /> },
    { path: '/edit-flashcard/:id', element: <PrivateRoute component={EditFlashcard} /> },
    { path: '/review', element: <PrivateRoute component={ReviewSession} /> },
    { path: '/profile', element: <PrivateRoute component={Profile} /> },
    { path: '/settings', element: <PrivateRoute component={Settings} /> },
    { path: '/practice', element: <PrivateRoute component={PracticeSession} /> },
    { path: '/practice/:deckId', element: <PrivateRoute component={PracticeSession} /> },
    { path: '/predefined-decks', element: <PrivateRoute component={PredefinedDecks} /> },
    { path: '/ai-generate', element: <PrivateRoute component={AIGenerator} /> },
    { path: '/practice/ai-:deckId', element: <PrivateRoute component={PracticeSession} /> },
    {path: '/ai-decks',element: <PrivateRoute component={AIDecks} />},
    { path: '/', element: auth?.token ? <Dashboard /> : <Login /> }
  ];

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Navbar />
      <DarkModeToggle />
      <div className="container flex-grow-1">
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
export default App;