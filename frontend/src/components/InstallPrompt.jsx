import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOs, setIsIOs] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if device is iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOs(isIosDevice);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        if (isStandalone) {
            setIsInstalled(true);
        }

        // --- Android / Chrome Logic ---
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
            console.log('PWA was installed');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    useEffect(() => {
        // Show popup after 3 seconds
        const timer = setTimeout(() => {
            if (isInstalled) return;

            // Check for Mobile (Android/iOS)
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isMobile = /android|iphone|ipad|ipod/.test(userAgent);

            if (!isMobile) {
                console.log('PC device detected, suppressing install prompt as requested.');
                return;
            }

            // Scenario 1: Android - we need the deferredPrompt event
            if (!isIOs && deferredPrompt) {
                setShowPrompt(true);
            }
            // Scenario 2: iOS - show instructions always if not installed
            else if (isIOs && !isInstalled) {
                setShowPrompt(true);
            }

        }, 3000);

        return () => clearTimeout(timer);
    }, [isInstalled, deferredPrompt, isIOs]);


    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleClose = () => {
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="install-prompt-overlay">
            <div className="install-card">
                <button className="install-close" onClick={handleClose}>×</button>
                <div className="install-content">
                    <div className="install-icon-wrapper">
                        {/* Mobile Phone Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                    </div>

                    <div className="install-text">
                        <h3>Installer ArtisanFlow</h3>
                        {isIOs ? (
                            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                                <p style={{ marginBottom: '8px' }}>Pour installer sur iPhone / iPad :</p>
                                <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.5' }}>
                                    <li>Appuyez sur le bouton <strong>Partager</strong> <span style={{ fontSize: '1.2em' }}>⎋</span></li>
                                    <li>Choisissez <strong>"Sur l'écran d'accueil"</strong> <span style={{ fontSize: '1.2em' }}>⊕</span></li>
                                </ol>
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                                <p style={{ marginBottom: '8px' }}>Accédez rapidement à votre espace depuis votre écran d'accueil.</p>
                            </div>
                        )}
                        <p style={{ marginTop: '12px', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                            Pour utiliser votre application sur ordinateur, rendez-vous sur <strong>www.artisanflow-appli.com</strong> et cliquez sur "INSTALLER SUR ORDINATEUR" en dessous du bouton INSCRIPTION.
                        </p>
                    </div>
                </div>

                {!isIOs && (
                    <button className="install-btn" onClick={handleInstallClick}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Installer l'application
                    </button>
                )}

                {isIOs && (
                    <button className="install-btn" onClick={handleClose} style={{ backgroundColor: '#334155' }}>
                        J'ai compris
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstallPrompt;
