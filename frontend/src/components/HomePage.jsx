import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';
import LanguageSelector from './LanguageSelector';

const HomePage = () => {
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = React.useState(false);
    const [showFavoriteModal, setShowFavoriteModal] = React.useState(false);

    React.useEffect(() => {
        // Check for Desktop
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile = /android|iphone|ipad|ipod/.test(userAgent);
        setIsDesktop(!isMobile);

        console.log('Debug PWA: Desktop detected?', !isMobile, 'UserAgent:', userAgent);
    }, []);

    return (
        <div className="home-container">
            <header className="header">
                <LanguageSelector />

            </header>

            <main className="main-content">
                <div className="logo-container">
                    <img src="/logo.png" alt="ArtisanFlow Logo" className="main-logo" />
                </div>

                <h1 className="brand-title">ARTISANFLOW</h1>

                <p className="main-subtitle">
                    CONCENTREZ-VOUS SUR VOTRE ACTIVITÉ,<br />
                    ARTISANFLOW AUTOMATISE TOUT LE RESTE.
                </p>

                <div className="offer-badges">
                    <div className="badge">Accès Gratuit à toutes les fonctions jusqu'au 31 août 2026</div>
                    <div className="badge">Aucun prélèvement avant le 1er septembre</div>
                </div>

                <div className="value-prop">
                    <h2>ArtisanFlow :</h2>
                    <h3>L'IA gère l'intégralité, vous créez l'essentiel.</h3>
                    <p className="description-text">
                        Devis dictés, factures automatiques, gestion de stock et comptabilité<br />
                        IA.
                    </p>
                </div>

                <div className="actions">
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>SE CONNECTER</button>
                    <button className="btn btn-primary" onClick={() => navigate('/register')}>INSCRIPTION</button>

                    {isDesktop && (
                        <>
                            <button
                                className="btn btn-primary"
                                style={{
                                    marginTop: '10px',
                                    backgroundColor: '#e2e8f0',
                                    color: '#0f172a',
                                    border: '1px solid #cbd5e1'
                                }}
                                onClick={() => setShowFavoriteModal(true)}
                            >
                                Ajouter ArtisanFlow en favori sur ordinateur
                            </button>

                            {showFavoriteModal && (
                                <div style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    zIndex: 1000,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        backgroundColor: '#1e293b',
                                        padding: '30px',
                                        borderRadius: '12px',
                                        maxWidth: '500px',
                                        width: '90%',
                                        textAlign: 'left',
                                        color: '#fff',
                                        border: '1px solid #334155',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                                    }}>
                                        <h3 style={{ marginTop: 0, color: '#f97316', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '10px' }}>🖥️</span>
                                            Accès rapide à ArtisanFlow sur ordinateur
                                        </h3>

                                        <p style={{ lineHeight: '1.6' }}>
                                            Pour accéder rapidement à ArtisanFlow depuis votre ordinateur, vous pouvez l’ajouter à vos favoris en quelques secondes.
                                        </p>

                                        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
                                            <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#e2e8f0' }}>Étapes :</p>
                                            <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                                                <li>Appuyez sur <span style={{ backgroundColor: '#334155', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>Ctrl + D</span> sur votre clavier</li>
                                                <li>Cliquez sur <strong>Ajouter</strong></li>
                                            </ol>
                                            <p style={{ marginTop: '10px', marginBottom: 0 }}>
                                                ArtisanFlow sera ensuite accessible en un clic depuis vos favoris.
                                            </p>
                                        </div>

                                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                            ℹ️ Cette méthode est la plus simple et fonctionne sur tous les navigateurs (Chrome, Edge, Firefox).
                                        </p>

                                        <div style={{ marginTop: '25px', textAlign: 'center' }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setShowFavoriteModal(false)}
                                                style={{ minWidth: '150px' }}
                                            >
                                                J'ai compris
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="login-links">
                        <div className="link-row mt-small">
                            <Link to="/admin/login" className="text-orange">accès admin</Link>
                            <span className="separator">|</span>
                            <Link to="/contact" className="text-orange">contact</Link>
                            <span className="separator">|</span>
                            <Link to="/mentions-legales" className="text-orange">mentions légales</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
