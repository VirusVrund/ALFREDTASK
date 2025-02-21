import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/axios';
import DeckCard from './DeckCard';

const PredefinedDecks = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDecks();
    }, []);

    const fetchDecks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/predefined-decks');
            setDecks(response.data);
        } catch (err) {
            console.error('Failed to fetch predefined decks:', err);
            setError('Failed to load predefined decks');
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
                        onClick={fetchDecks}
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
                <h2>Choose a Practice Deck</h2>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/practice')}
                >
                    Back to Practice
                </button>
            </div>

            <div className="row">
                {decks.map(deck => (
                    <DeckCard
                        key={deck.id}
                        deck={deck}
                        onSelect={() => navigate(`/practice/${deck.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PredefinedDecks;