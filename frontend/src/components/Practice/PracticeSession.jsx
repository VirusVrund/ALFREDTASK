import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/axios';
import FlipCard from '../Common/FlipCard';

const PracticeSession = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionStats, setSessionStats] = useState({
        correct: 0,
        incorrect: 0
    });
    const navigate = useNavigate();
    const { deckId } = useParams();

    useEffect(() => {
        if (deckId === 'my-cards') {
            fetchUserCards();
        } else if (deckId?.startsWith('ai-')) {
            const aiDeckId = deckId.replace('ai-', '');
            fetchAICards(aiDeckId);
        } else if (deckId) {
            fetchPredefinedCards(deckId);
        } else {
            setLoading(false);
        }
    }, [deckId]);
    // Add new function to fetch AI cards
    const fetchAICards = async (deckId) => {
        try {
            setLoading(true);
            // Using the predefined decks category route with 'ai-generated' category
            const response = await api.get(`/predefined-decks/category/ai-generated`);
            // Find the specific deck from the AI-generated category
            const aiDeck = response.data.find(deck => {
                return deck._id === deckId
            });

            if (!aiDeck || !aiDeck.cards?.length) {
                setError('No flashcards found in this AI deck!');
                return;
            }

            const shuffledCards = aiDeck.cards.sort(() => Math.random() - 0.5);
            setFlashcards(shuffledCards);
            setSessionStarted(true);
        } catch (err) {
            console.error('Failed to fetch AI deck:', err);
            setError('Failed to load AI deck');
        } finally {
            setLoading(false);
        }
    };


    const fetchUserCards = async () => {
        try {
            setLoading(true);
            const response = await api.get('/flashcards');
            if (!response.data.length) {
                setError('No flashcards found. Create some cards first!');
                return;
            }
            const shuffledCards = response.data.sort(() => Math.random() - 0.5);
            setFlashcards(shuffledCards);
            setSessionStarted(true);
        } catch (err) {
            console.error('Failed to fetch flashcards:', err);
            setError('Failed to load practice session');
        } finally {
            setLoading(false);
        }
    };

    const fetchPredefinedCards = async (deckId) => {
        try {
            setLoading(true);
            const response = await api.get(`/predefined-decks/${deckId}`);
            if (!response.data || !response.data.cards.length) {
                setError('No flashcards found in this deck!');
                return;
            }
            const shuffledCards = response.data.cards.sort(() => Math.random() - 0.5);
            setFlashcards(shuffledCards);
            setSessionStarted(true);
        } catch (err) {
            console.error('Failed to fetch predefined deck:', err);
            setError('Failed to load predefined deck');
        } finally {
            setLoading(false);
        }
    };


    const handleResponse = (correct) => {
        setSessionStats(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            incorrect: prev.incorrect + (correct ? 0 : 1)
        }));

        setShowAnswer(false);
        setTimeout(() => {
            if (currentIndex < flashcards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                navigate('/dashboard', {
                    state: {
                        message: `Practice completed! Correct: ${sessionStats.correct + (correct ? 1 : 0)}, Incorrect: ${sessionStats.incorrect + (correct ? 0 : 1)}`,
                        type: 'success'
                    }
                });
            }
        }, 300);
    };

    if (!sessionStarted && !deckId) {
        return (
            <div className="container mt-4">
                <h2 className="text-center mb-4">Choose Your Practice Mode</h2>
                <div className="row justify-content-center align-items-stretch g-4">
                    <div className="col-md-4">
                        <div
                            className="card h-100 practice-mode-card user-cards"
                            onClick={() => navigate('/practice/my-cards')}
                        >
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <i className="bi bi-person-workspace mb-3 fs-1"></i>
                                <h5 className="card-title">My Flashcards</h5>
                                <p className="card-text text-muted">Practice with your personal collection</p>
                                <div className="mt-auto">
                                    <button className="btn btn-outline-primary mt-3">
                                        Start Practice <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            className="card h-100 practice-mode-card ai-cards"
                            onClick={() => navigate('/ai-decks')}
                        >
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <i className="bi bi-robot mb-3 fs-1"></i>
                                <h5 className="card-title">AI Generated Decks</h5>
                                <p className="card-text text-muted">Practice with AI generated flashcards</p>
                                <div className="mt-auto">
                                    <button className="btn btn-outline-info mt-3">
                                        Browse AI Decks <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            className="card h-100 practice-mode-card predefined-cards"
                            onClick={() => navigate('/predefined-decks')}
                        >
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <i className="bi bi-collection mb-3 fs-1"></i>
                                <h5 className="card-title">Predefined Decks</h5>
                                <p className="card-text text-muted">Practice with our curated collection</p>
                                <div className="mt-auto">
                                    <button className="btn btn-outline-info mt-3">
                                        Browse Decks <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Your existing loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Your existing error state
    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                    <button
                        className="btn btn-outline-danger btn-sm ms-3"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Your existing empty state
    if (flashcards.length === 0) {
        return (
            <div className="container mt-4 text-center">
                <h3>No flashcards available</h3>
                <p>Create some flashcards to start practicing!</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/create-flashcard')}
                >
                    Create New Flashcard
                </button>
            </div>
        );
    }

    // practice session UI
    const currentCard = flashcards[currentIndex];
    const progress = ((currentIndex + 1) / flashcards.length) * 100;

    return (
        <div className="container mt-4">
            <div className="mb-4">
                <h2 className="text-center mb-3">Practice Mode</h2>
                <div className="progress" style={{ height: '1.5rem' }}>
                    <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        {currentIndex + 1} / {flashcards.length}
                    </div>
                </div>
                <div className="text-center mt-2">
                    <small className="text-muted">
                        Correct: {sessionStats.correct} | Incorrect: {sessionStats.incorrect}
                    </small>
                </div>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <FlipCard
                    frontContent={currentCard.question}
                    backContent={currentCard.answer}
                    isFlipped={showAnswer}
                    onClick={() => setShowAnswer(!showAnswer)}
                    onResponse={handleResponse}
                />

                <div className="text-center mt-3">
                    <small className="text-muted">
                        Cards Remaining: {flashcards.length - currentIndex - 1}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PracticeSession;