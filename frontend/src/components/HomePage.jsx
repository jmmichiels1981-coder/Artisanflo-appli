import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';
import LanguageSelector from './LanguageSelector';

const HomePage = () => {
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = React.useState(false);

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
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
                            <button
                                className="btn btn-primary"
                                style={{
                                    marginTop: '10px',
                                    backgroundColor: '#e2e8f0',
                                    color: '#0f172a',
                                    border: '1px solid #cbd5e1',
                                    width: '100%'
                                }}
                                onClick={() => window.location.href = 'https://github.com/jmmichiels1981-coder/Artisanflo-appli/releases/download/v0.1.0/artisanflow_0.1.0_x64-setup.exe'}
                            >
                                INSTALLER SUR L'ORDINATEUR
                            </button>

                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginTop: '10px', marginBottom: '15px' }}>
                                Application officielle ArtisanFlow pour Windows.<br />
                                Compatible Chrome, Edge et Firefox.
                            </p>

                            <div style={{
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '8px',
                                padding: '15px',
                                textAlign: 'left',
                                fontSize: '0.85rem',
                                color: '#e2e8f0',
                                width: '100%'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: '#60a5fa', fontWeight: 'bold' }}>
                                    <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>ℹ️</span>
                                    Info Sécurité Windows
                                </div>
                                <p style={{ margin: 0, lineHeight: '1.5' }}>
                                    Lors de la première installation, Windows peut afficher un message de sécurité.<br />
                                    Cliquez sur <strong>« Informations complémentaires »</strong>, puis sur <strong>« Exécuter quand même »</strong>.
                                </p>
                                <p style={{ marginTop: '8px', marginBottom: 0, fontStyle: 'italic', opacity: 0.8, fontSize: '0.8rem' }}>
                                    L'application ArtisanFlow est officielle et sécurisée. Ce message est informatif, pas bloquant.
                                </p>
                            </div>
                        </div>
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
