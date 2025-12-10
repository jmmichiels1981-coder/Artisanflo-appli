import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import LanguageSelector from './LanguageSelector';

const LoginPage = () => {
    return (
        <div className="login-container">
            <header className="header">
                <LanguageSelector />

            </header>

            <div className="login-content">
                <div className="logo-section">
                    <img src="/logo.jpg" alt="ArtisanFlow Logo" className="login-logo" />
                    <h1 className="brand-title-small">ARTISANFLOW</h1>
                    <h2 className="page-subtitle">CONNEXION</h2>
                </div>

                <div className="login-card">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="votre@email.fr" className="input-field" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" placeholder="........" className="input-field" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pin">Code PIN (4 chiffres)</label>
                        <input type="password" id="pin" placeholder="...." maxLength="4" className="input-field" />
                    </div>

                    <button className="btn btn-primary login-btn">SE CONNECTER</button>

                    <div className="login-links">
                        <div className="link-row-center">
                            <a href="#" className="text-orange">Mot de passe oublié ?</a>
                            <span className="separator">|</span>
                            <a href="#" className="text-orange">Code PIN oublié ?</a>
                        </div>
                        <div className="link-row-center mt-2">
                            <span className="text-white-small">Pas encore de compte ?</span>
                            <Link to="/register" className="text-orange ml-1">Créer un compte</Link>
                        </div>
                        <div className="link-row-center mt-3">
                            <Link to="/" className="text-orange">← Retour à l'accueil</Link>
                            <span className="separator">|</span>
                            <a href="#" className="text-orange">Mentions légales</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
