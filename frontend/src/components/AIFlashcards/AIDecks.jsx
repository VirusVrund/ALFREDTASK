import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import DeckCard from '../Practice/PredefinedDecks/DeckCard';
import { toast } from 'react-toastify';

const AIDecks = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAIDecks();
    }, []);
    const handleDeleteDeck = async (deckId) => {
        try {
            await api.delete(`/ai-flashcards/${deckId}`);
            setDecks(prevDecks => prevDecks.filter(deck => deck._id !== deckId));
            toast.success('Deck deleted successfully');
        } catch (err) {
            toast.error('Failed to delete deck');
        }
    };

    const fetchAIDecks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/ai-flashcards/my-decks');
            setDecks(response.data);
        } catch (err) {
            console.error('Failed to fetch AI decks:', err);
            setError('Failed to load AI decks');
        } finally {
            setLoading(false);
        }
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
                        onClick={fetchAIDecks}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }



    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>AI Generated Decks</h2>
                <div>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => navigate('/ai-generate')}
                    >
                        <i className="bi bi-robot me-2"></i>
                        Generate New Deck
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/practice')}
                    >
                        Back to Practice
                    </button>
                </div>
            </div>

            {decks.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted mb-4">You haven't generated any AI decks yet.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/ai-generate')}
                    >
                        <i className="bi bi-robot me-2"></i>
                        Generate Your First Deck
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {decks.map(deck => (
                        <DeckCard
                            key={deck._id}
                            deck={{
                                id: deck._id,
                                title: deck.title,
                                description: `AI Generated • ${deck.cards?.length || 0} cards`,
                                theme: 'info',
                                cardCount: deck.cards?.length || 0
                            }}
                            onSelect={() => navigate(`/practice/ai-${deck._id}`)}
                            onDelete={() => handleDeleteDeck(deck._id)}
                            showDelete={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AIDecks;