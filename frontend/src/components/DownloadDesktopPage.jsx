import React from 'react';
import { useNavigate } from 'react-router-dom';

const DownloadDesktopPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#0f172a',
            color: '#fff',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ color: '#E85D04', marginBottom: '20px' }}>Application de Bureau</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#cbd5e1' }}>
                Le téléchargement de l'application native sera bientôt disponible.
            </p>
            <button
                onClick={() => navigate('/')}
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#E85D04',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                Retour à l'accueil
            </button>
        </div>
    );
};

export default DownloadDesktopPage;
