import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="bi bi-lightning-charge-fill me-2"></i>
                    <div className="d-flex flex-column">
                        <span>MINDFLIP</span>
                        <small className="text-muted" style={{ fontSize: '0.6em', letterSpacing: '0.1em' }}>
                            Flip cards, flip knowledge!
                        </small>
                    </div>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {auth.token && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                        to="/dashboard"
                                    >
                                        <i className="bi bi-speedometer2 me-1"></i>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/all-flashcards' ? 'active' : ''}`}
                                        to="/all-flashcards"
                                    >
                                        <i className="bi bi-collection me-1"></i>
                                        My Cards
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/create-flashcard' ? 'active' : ''}`}
                                        to="/create-flashcard"
                                    >
                                        <i className="bi bi-plus-circle me-1"></i>
                                        Create Card
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/ai-generate' ? 'active' : ''}`}
                                        to="/ai-generate"
                                    >
                                        <i className="bi bi-robot me-1"></i>
                                        AI Generator
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {auth.token ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                                        to="/profile"
                                    >
                                        <i className="bi bi-person-circle me-1"></i>
                                        {auth.username}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="nav-link"
                                        onClick={logout}
                                    >
                                        <i className="bi bi-box-arrow-right me-1"></i>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                                    to="/login"
                                >
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;