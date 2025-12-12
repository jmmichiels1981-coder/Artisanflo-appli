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

    const handleDownloadShortcut = () => {
        // Generate .url file content for Windows
        const productionUrl = 'https://www.artisanflow-appli.com';
        const urlContent = `[InternetShortcut]\nURL=${productionUrl}\nIconIndex=0`;
        const blob = new Blob([urlContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ArtisanFlow.url';
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show confirmation
        alert("Raccourci créé ! Vérifiez vos téléchargements et placez le fichier 'ArtisanFlow.url' sur votre bureau.");
    };

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

                    {isDesktop && (
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '10px', backgroundColor: '#e2e8f0', color: '#0f172a', border: '1px solid #cbd5e1' }}
                            onClick={handleDownloadShortcut}
                        >
                            INSTALLER SUR ORDINATEUR
                        </button>
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
