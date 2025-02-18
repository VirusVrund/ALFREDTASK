import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import FlipCard from '../Common/FlipCard';

const PracticeSession = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionStats, setSessionStats] = useState({
        correct: 0,
        incorrect: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const fetchFlashcards = async () => {
        try {
            setLoading(true);
            const response = await api.get('/flashcards');
            if (!response.data.length) {
                setError('No flashcards found. Create some cards first!');
                return;
            }
            // Shuffle the cards for random practice
            const shuffledCards = response.data.sort(() => Math.random() - 0.5);
            setFlashcards(shuffledCards);
        } catch (err) {
            console.error('Failed to fetch flashcards:', err);
            setError('Failed to load practice session');
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = (correct) => {
        // Update session stats
        setSessionStats(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            incorrect: prev.incorrect + (correct ? 0 : 1)
        }));

        setShowAnswer(false);
        // Move to next card or end session
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

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