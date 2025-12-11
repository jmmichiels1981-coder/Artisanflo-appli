import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        pin: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/admin-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                if (data.token) {
                    localStorage.setItem('adminToken', data.token);
                }
                navigate('/admin/dashboard');
                console.log("Admin Logged In");
            } else {
                alert(data.message || "Identifiants incorrects");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur de connexion serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0f172a', // Dark blue/slate background
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                padding: '20px',
                textAlign: 'center'
            }}>
                {/* Shield Icon Area */}
                <div style={{ marginBottom: '20px' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto', display: 'block' }}>
                        <path d="M12 2L3 7V12C3 17.52 7.03 22.46 12 23.63C16.97 22.46 21 17.52 21 12V7L12 2Z" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
                    Console Admin
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '40px' }}>
                    ArtisanFlow - Panneau d'administration
                </p>

                {/* Login Card */}
                <div style={{
                    backgroundColor: '#1e293b', // Slightly lighter dark blue
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #334155'
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
                                ✉️ Email Admin
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@artisanflow.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#334155',
                                    border: '1px solid #475569',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
                                🔒 Mot de passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#334155',
                                    border: '1px solid #475569',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* PIN */}
                        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                            <label style={{ display: 'block', color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '8px' }}>
                                🔓 Code PIN (4 chiffres)
                            </label>
                            <input
                                type="password"
                                name="pin"
                                placeholder="••••"
                                maxLength="4"
                                value={formData.pin}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#334155',
                                    border: '1px solid #475569',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    outline: 'none',
                                    textAlign: 'center',
                                    letterSpacing: '5px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#f97316',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: isLoading ? 'wait' : 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px' }}>
                        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
