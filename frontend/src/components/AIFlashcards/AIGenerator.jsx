import React, { useState } from 'react';
import api from '../../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AIGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [cardCount, setCardCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [file, setFile] = useState(null);
    const [generationType, setGenerationType] = useState('topic'); // 'topic' or 'pdf'
    const navigate = useNavigate();

    const handleGenerate = async (e) => {
        e.preventDefault();
        setValidationError(null);

        if (generationType === 'topic' && !prompt.trim()) {
            toast.warning('Please enter a topic to generate flashcards');
            return;
        }

        if (generationType === 'pdf' && !file) {
            toast.warning('Please select a PDF file');
            return;
        }

        setLoading(true);

        try {
            let response;
            if (generationType === 'topic') {
                response = await api.post('/ai-flashcards/generate', {
                    prompt,
                    cardCount
                });
            } else {
                const formData = new FormData();
                formData.append('pdf', file);
                formData.append('cardCount', cardCount);
                response = await api.post('/ai-flashcards/upload-pdf', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data && response.data._id) {
                toast.success('Flashcards generated successfully!');
                setTimeout(() => {
                    navigate(`/practice/ai-${response.data._id}`);
                }, 1000);
            }
        } catch (error) {
            // Add this enhanced error logging
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });

           
            if (error.response?.status === 400) {
                setValidationError({
                    reason: error.response.data.message,
                    category: error.response.data.category,
                    
                });
                toast.error('Invalid input..');
            } else {
                toast.error(error.response?.data?.message || 'Failed to generate flashcards');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Please upload a PDF file');
                setFile(null); // Reset file state if invalid
                e.target.value = ''; // Reset input
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error('File size must be less than 10MB');
                setFile(null);
                e.target.value = '';
                return;
            }
            setFile(selectedFile);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="card-title h3 mb-0">Generate AI Flashcard Deck</h2>
                                <Link to="/ai-decks" className="btn btn-outline-primary">
                                    <i className="bi bi-collection me-2"></i>
                                    My AI Decks
                                </Link>
                            </div>

                            <ul className="nav nav-tabs mb-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${generationType === 'topic' ? 'active' : ''}`}
                                        onClick={() => setGenerationType('topic')}
                                    >
                                        <i className="bi bi-lightbulb me-2"></i>
                                        Topic Based
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${generationType === 'pdf' ? 'active' : ''}`}
                                        onClick={() => setGenerationType('pdf')}
                                    >
                                        <i className="bi bi-file-pdf me-2"></i>
                                        PDF Upload
                                    </button>
                                </li>
                            </ul>

                            {validationError && (
                                <div className="alert alert-warning mb-4">
                                    <h6 className="mb-2">Validation Error:</h6>
                                    <p className="mb-0">{validationError.reason}</p>
                                </div>
                            )}

                            <form onSubmit={handleGenerate}>
                                {generationType === 'topic' ? (
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">
                                            What would you like to learn about?
                                        </label>
                                        <input
                                            type="text"
                                            value={prompt}
                                            onChange={(e) => {
                                                setPrompt(e.target.value);
                                                setValidationError(null);
                                            }}
                                            className={`form-control form-control-lg ${validationError ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Machine Learning , art"
                                            disabled={loading}
                                        />
                                        <small className="text-muted d-block mt-2">
                                            <i className="bi bi-info-circle me-1"></i>
                                            For best results, provide a concise topic name (3-4 words)
                                        </small>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">
                                            Upload PDF Document
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            disabled={loading}
                                        />
                                        <div className="text-muted mt-2 small">
                                            <div>
                                                <i className="bi bi-info-circle me-1"></i>
                                                Maximum file size: 10MB
                                            </div>
                                            <div className="mt-1">
                                                <i className="bi bi-clock me-1"></i>
                                                Note: Only the first 1000 words will be processed. Generation may take a few minutes.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        Number of flashcards
                                    </label>
                                    <div className="row row-cols-2 row-cols-sm-4 g-2">
                                        {[10, 15, 20, 25].map((count) => (
                                            <div key={count} className="col">
                                                <button
                                                    type="button"
                                                    className={`btn w-100 ${cardCount === count ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => setCardCount(count)}
                                                    disabled={loading}
                                                >
                                                    {count}
                                                    <small className="d-block">cards</small>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || (generationType === 'pdf' && !file)}
                                    className="btn btn-primary btn-lg w-100"
                                >
                                    {loading ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Generating...
                                        </div>
                                    ) : (
                                        'Generate Flashcards'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIGenerator;