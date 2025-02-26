import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
const AllFlashcards = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/flashcards/${id}`);
            setFlashcards(cards => cards.filter(card => card._id !== id));
            toast.success('Flashcard deleted successfully');
        } catch (err) {
            setError('Failed to delete flashcard');
        }
    };

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                setLoading(true);
                const response = await api.get('/flashcards');
                setFlashcards(response.data || []);
            } catch (err) {
                setError('Failed to load flashcards');
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcards();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center mt-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            {flashcards.length > 0 ? (
                <>
                    <div className="mb-4">
                        <h2 className="h3 mb-3">All Flashcards</h2>
                        <div className="d-flex justify-content-end">
                            <Link
                                to="/create-flashcard"
                                className="btn btn-primary py-1 px-3"
                                style={{ fontSize: '0.875rem' }}
                            >
                                <i className="bi bi-plus-circle me-1"></i>
                                <span className="d-none d-md-inline">Create New</span>
                                <span className="d-md-none">New</span>
                            </Link>
                        </div>
                    </div>

                    <div className="row g-4">
                        {flashcards.map(card => (
                            <div key={card._id} className="col-md-6 col-lg-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h5 className="card-title">Question</h5>
                                            <div className="btn-group">
                                                <Link
                                                    to={`/edit-flashcard/${card._id}`}
                                                    state={{ flashcard: card }}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="bi bi-pencil"></i> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(card._id)}
                                                    className="btn btn-outline-danger btn-sm ms-2"
                                                >
                                                    <i className="bi bi-trash"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                        <p className="card-text">{card.question}</p>
                                        <hr />
                                        <h5 className="card-title">Answer</h5>
                                        <p className="card-text">{card.answer}</p>
                                        <div className="mt-3">
                                            <span className="badge bg-primary me-2">Box {card.box}</span>
                                            <small className="text-muted">
                                                Next Review: {new Date(card.nextReviewDate).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>

            ) : (
                <div className="text-center mt-5">
                    <div className="mb-4">
                        <i className="bi bi-collection display-1 text-muted"></i>
                    </div>
                    <h3>No flashcards yet</h3>
                    <p className="text-muted mb-4">Create your first flashcard to start learning</p>
                    <Link to="/create-flashcard" className="btn btn-primary btn-lg">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create First Card
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AllFlashcards;