import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/axios';

const StatCard = ({ title, value, icon, color }) => (
    <div className="col-md-6 col-lg-3">
        <div className="card h-100 dashboard-stat-card">
            <div className="card-body text-center">
                <i className={`bi ${icon} mb-3 text-${color}`} style={{ fontSize: '2rem' }}></i>
                <h5 className="card-title">{title}</h5>
                <p className="card-text display-4">{value}</p>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState({
        totalCards: 0,
        dueToday: 0,
        boxCounts: [0, 0, 0, 0, 0],
        successRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/flashcards');
            const cards = response.data || [];

            const today = new Date();
            const dueCards = cards.filter(card => new Date(card.nextReviewDate) <= today);
            const boxCounts = [0, 0, 0, 0, 0];

            cards.forEach(card => {
                if (card.box >= 1 && card.box <= 5) {
                    boxCounts[card.box - 1]++;
                }
            });

            setStats({
                totalCards: cards.length,
                dueToday: dueCards.length,
                boxCounts,
                successRate: calculateSuccessRate(cards)
            });
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const calculateSuccessRate = (cards) => {
        if (!cards.length) return 0;

        const totalAnswered = cards.filter(card => card.box >= 1).length;
        const totalCorrect = cards.filter(card => card.box > 1).length;

        if (totalAnswered === 0) return 0;

        return Math.round((totalCorrect / totalAnswered) * 100);
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

    return (
        <div className="container mt-4">
            {location.state?.message && (
                <div className={`alert alert-${location.state?.type || 'success'} alert-dismissible fade show`} role="alert">
                    {location.state.message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-6">
                    <h2 className="dashboard-welcome">Hey {auth.username}, great to see you!</h2>
                </div>
                <div className="col-md-6 text-md-end d-flex justify-content-end gap-3">
                    {stats.dueToday > 0 && (
                        <Link to="/review" className="btn btn-success btn-lg">
                            <i className="bi bi-play-circle me-2"></i>
                            Start Review ({stats.dueToday})
                        </Link>
                    )}
                    <Link to="/create-flashcard" className="btn btn-outline-primary btn-lg">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Card
                    </Link>
                    <Link to="/practice" className="btn btn-outline-warning btn-lg">
                        <i className="bi bi-lightning-charge me-2"></i>
                        Practice Mode
                    </Link>
                </div>
            </div>

            <div className="row g-4">
                <StatCard
                    title="Total Cards"
                    value={stats.totalCards}
                    icon="bi-collection"
                    color="primary"
                />
                <StatCard
                    title="Due Today"
                    value={stats.dueToday}
                    icon="bi-calendar-check"
                    color="warning"
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats.successRate}%`}
                    icon="bi-graph-up"
                    color="success"
                />
                <StatCard
                    title="Mastered"
                    value={stats.boxCounts[4]}
                    icon="bi-trophy"
                    color="info"
                />

                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Learning Progress</h5>
                            {stats.totalCards > 0 ? (
                                <>
                                    <div className="progress" style={{ height: '2rem' }}>
                                        {stats.boxCounts.map((count, index) => (
                                            <div
                                                key={index}
                                                className={`progress-bar bg-${index === 4 ? 'success' : index === 0 ? 'danger' : 'warning'}`}
                                                style={{
                                                    width: `${(count / stats.totalCards) * 100}%`,
                                                    opacity: 0.6 + (index * 0.1)
                                                }}
                                                title={`Box ${index + 1}: ${count} cards`}
                                            >
                                                Box {index + 1}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-muted">
                                        <small>Box distribution showing your learning progress</small>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted py-3">
                                    <p>No cards available to show progress</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;