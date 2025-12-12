import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Icons (using SVGs for portability)
    const ShieldIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );

    const UserIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );

    const FileTextIcon = () => ( // Invoice
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
    );

    const ScrollIcon = () => ( // Quote/Devis
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );

    const DollarIcon = () => ( // Finances
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );

    const ChartIcon = () => ( // Performance
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );

    const MailIcon = () => ( // Messagerie
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );

    const [stats, setStats] = React.useState({ users: 0, invoices: 0, quotes: 0 });

    React.useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://artisanflow-api-prod.onrender.com';
                const response = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('authToken');
                    navigate('/admin/login');
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching admin stats", error);
            }
        };

        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/admin/login');
    };

    return (
        <div className="admin-dashboard-container">
            {/* Header */}
            <div className="admin-header">
                <div className="header-left">
                    <div className="header-icon">
                        <ShieldIcon />
                    </div>
                    <div className="header-title">
                        <h1>Console Admin</h1>
                        <p>ArtisanFlow - Panneau d'administration</p>
                    </div>
                </div>
                <div className="header-right">
                    <Link to="/" className="btn-back">
                        ← Retour à l'accueil
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Banner */}
            <div className="admin-banner">
                <div className="banner-header">
                    <div style={{ width: '20px' }}><ShieldIcon /></div>
                    <span>Accès Administrateur</span>
                </div>
                <p className="banner-desc">
                    Bienvenue dans la console d'administration d'ArtisanFlow.
                </p>
                <div className="banner-info">
                    <div className="info-item">
                        <h4>Email support :</h4>
                        <p>sav@artisanflow-appli.com</p>
                    </div>
                    <div className="info-item">
                        <h4>Domaine :</h4>
                        <p>artisanflow-appli.com</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-grid">
                {/* Utilisateurs */}
                <div className="stat-card card-blue">
                    <div className="card-header">
                        <div className="card-icon" style={{ stroke: '#60a5fa' }}><UserIcon /></div>
                        <span className="card-label" style={{ color: '#60a5fa' }}>UTILISATEURS</span>
                    </div>
                    <div className="card-value">{stats.users}</div>
                    <div className="card-subtext">Comptes artisans</div>
                </div>

                {/* Factures */}
                <div className="stat-card card-green">
                    <div className="card-header">
                        <div className="card-icon" style={{ stroke: '#34d399' }}><FileTextIcon /></div>
                        <span className="card-label" style={{ color: '#34d399' }}>FACTURES</span>
                    </div>
                    <div className="card-value">{stats.invoices}</div>
                    <div className="card-subtext">Total générées</div>
                </div>

                {/* Devis */}
                <div className="stat-card card-purple">
                    <div className="card-header">
                        <div className="card-icon" style={{ stroke: '#a78bfa' }}><ScrollIcon /></div>
                        <span className="card-label" style={{ color: '#a78bfa' }}>DEVIS</span>
                    </div>
                    <div className="card-value">{stats.quotes}</div>
                    <div className="card-subtext">Total créés</div>
                </div>

                {/* Console Test */}
                <div className="stat-card card-orange">
                    <div className="card-header">
                        <div className="card-icon" style={{ stroke: '#fb923c' }}><ShieldIcon /></div>
                        <span className="card-label" style={{ color: '#fb923c' }}>DÉMO INVESTISSEURS</span>
                    </div>
                    <span className="card-test-title">Console Test</span>
                    <div className="card-subtext">Accéder au tableau de bord</div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="features-grid">
                {/* Finances */}
                <div className="feature-card">
                    <div className="feature-icon-box bg-green">
                        <div style={{ width: '24px' }}><DollarIcon /></div>
                    </div>
                    <div className="feature-content">
                        <h3>Finances</h3>
                        <p>Suivi global des revenus, dépenses et projections.</p>
                    </div>
                </div>

                {/* Performance */}
                <div className="feature-card">
                    <div className="feature-icon-box bg-purple">
                        <div style={{ width: '24px' }}><ChartIcon /></div>
                    </div>
                    <div className="feature-content">
                        <h3>Performance</h3>
                        <p>Statistiques d'utilisation de la plateforme.</p>
                    </div>
                </div>

                {/* Messagerie */}
                <div className="feature-card">
                    <div className="feature-icon-box bg-blue">
                        <div style={{ width: '24px' }}><MailIcon /></div>
                    </div>
                    <div className="feature-content">
                        <h3>Messagerie</h3>
                        <p>Gestion des emails SAV et recommandations.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
