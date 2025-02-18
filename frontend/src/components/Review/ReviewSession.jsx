import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import FlipCard from '../Common/FlipCard';

const ReviewSession = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await api.get('/flashcards');
        const allCards = Array.isArray(response.data) ? response.data : [];

        // Filter cards due for review
        const today = new Date();
        const dueCards = allCards.filter(card => {
          const reviewDate = new Date(card.nextReviewDate);
          return reviewDate <= today;
        });

        setFlashcards(dueCards);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const calculateNextReviewDate = (box) => {
    const today = new Date();
    const daysToAdd = Math.pow(2, box - 1);
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString();
  };

  

  const handleResponse = async (correct) => {
    try {
      const currentCard = flashcards[currentIndex];
      const newBox = correct ?
        Math.min(currentCard.box + 1, 5) :
        1;
  
      const updateData = {
        box: newBox,
        nextReviewDate: calculateNextReviewDate(newBox)
      };
  
      await api.put(`/flashcards/${currentCard._id}`, updateData);
  
      // Reset flip state and update index with delay
      setShowAnswer(false);
      setTimeout(() => {
        if (currentIndex < flashcards.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          navigate('/dashboard', { state: { message: 'Review session completed!' } });
        }
      }, 300);
  
    } catch (err) {
      setError('Failed to update flashcard. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
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

  // Empty state
  if (flashcards.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <h3>🎉 All caught up!</h3>
        <p>No flashcards due for review today.</p>
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
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {currentIndex + 1} / {flashcards.length}
          </div>
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
            Current Box: {currentCard.box} |
            Cards Remaining: {flashcards.length - currentIndex - 1}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ReviewSession;