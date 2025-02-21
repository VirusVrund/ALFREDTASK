import React from 'react';

const DeckCard = ({ deck, onSelect }) => {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div 
                className="card h-100 dashboard-stat-card cursor-pointer"
                onClick={onSelect}
            >
                <div className="card-body">
                    <h5 className="card-title">{deck.title}</h5>
                    <p className="card-text text-muted">{deck.description}</p>
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                        <span className={`badge bg-${deck.theme}`}>
                            {deck.cardCount} cards
                        </span>
                        <i className="bi bi-arrow-right text-primary"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeckCard;