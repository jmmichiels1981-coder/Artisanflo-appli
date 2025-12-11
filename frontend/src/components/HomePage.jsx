import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';
import LanguageSelector from './LanguageSelector';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="header">
                <LanguageSelector />

            </header>

            <main className="main-content">
                <div className="logo-container">
                    <img src="/logo.jpg" alt="ArtisanFlow Logo" className="main-logo" />
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

                    <div className="login-links">
                        <div className="link-row mt-small">
                            <a href="#" className="text-orange">accès admin</a>
                            <span className="separator">|</span>
                            <Link to="/contact" className="text-orange">contact</Link>
                            <span className="separator">|</span>
                            <a href="#" className="text-orange">mentions légales</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
