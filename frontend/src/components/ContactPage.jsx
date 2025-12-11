import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config';

const ContactPage = () => {
    const [contactSending, setContactSending] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactSending(true);
        try {
            const res = await fetch(`${API_URL}/auth/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactForm)
            });
            if (res.ok) {
                alert("Message envoyé ! Nous vous répondrons rapidement.");
                setContactForm({ name: '', email: '', subject: '', message: '' });
            } else {
                alert("Erreur lors de l'envoi du message.");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur technique.");
        } finally {
            setContactSending(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000', // Assuming dark background based on modal styles
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#0a0a0a',
                padding: '40px',
                borderRadius: '15px',
                maxWidth: '500px',
                width: '100%',
                color: '#fff',
                textAlign: 'left',
                fontFamily: 'Arial, sans-serif',
                border: '1px solid #333'
            }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Nous contacter</h2>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '30px' }}>
                    Une question ? Notre équipe vous répond dans les plus brefs délais.
                </p>

                <form onSubmit={handleContactSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Votre nom"
                            value={contactForm.name}
                            onChange={handleContactChange}
                            required
                            style={{
                                width: '100%', padding: '15px', borderRadius: '30px',
                                backgroundColor: '#111', border: '1px solid #333',
                                color: '#fff', outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Votre email"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            required
                            style={{
                                width: '100%', padding: '15px', borderRadius: '30px',
                                backgroundColor: '#111', border: '1px solid #333',
                                color: '#fff', outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Sujet"
                            value={contactForm.subject}
                            onChange={handleContactChange}
                            required
                            style={{
                                width: '100%', padding: '15px', borderRadius: '30px',
                                backgroundColor: '#111', border: '1px solid #333',
                                color: '#fff', outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <textarea
                            name="message"
                            placeholder="Votre message"
                            value={contactForm.message}
                            onChange={handleContactChange}
                            required
                            rows="5"
                            style={{
                                width: '100%', padding: '15px', borderRadius: '15px',
                                backgroundColor: '#111', border: '1px solid #333',
                                color: '#fff', outline: 'none', resize: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={contactSending}
                        style={{
                            width: '100%', padding: '15px', borderRadius: '30px',
                            backgroundColor: '#f97316', border: 'none',
                            color: '#fff', fontWeight: 'bold', fontSize: '1rem',
                            cursor: contactSending ? 'wait' : 'pointer',
                            boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
                        }}
                    >
                        {contactSending ? 'ENVOI EN COURS...' : 'ENVOYER LE MESSAGE'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
                        ← Retour à l'accueil
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
