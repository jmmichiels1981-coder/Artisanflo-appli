import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import API_URL from '../config';
import './LoginPage.css';

const cardStyle = {
    backgroundColor: '#1a1b26', // Deep dark blue/grey
    borderRadius: '20px',
    padding: '40px',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};

const greenBoxStyle = {
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Green with low opacity
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10b981', // Bright green text
    padding: '15px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '25px',
    lineHeight: '1.5'
};

const tabButtonStyle = (isActive) => ({
    flex: 1,
    padding: '15px',
    backgroundColor: isActive ? '#f97316' : 'rgba(255,255,255,0.05)', // Orange if active
    color: '#fff',
    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    textAlign: 'center',
    transition: 'all 0.3s'
});

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state?.formData;

    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'sepa'
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form fields
    const [cardData, setCardData] = useState({
        number: '',
        zip: formData?.zipCode || '', // Auto-fill zip from Step 1
        expiry: '',
        cvc: ''
    });

    const [sepaData, setSepaData] = useState({ iban: '', mandateAccepted: false });

    // Handle Back Navigation preserving state
    const handleBack = () => {
        navigate('/register', { state: { formData } });
    };

    // Helper to extract Country Code from "Country - Price..." string
    const getCountryCode = (countryString) => {
        if (!countryString) return '';
        // Map common country names to codes if needed, or simple extraction
        const name = countryString.split(' -')[0].trim();
        const map = {
            'France': 'FR',
            'Belgique': 'BE',
            'Luxembourg': 'LU',
            'Suisse': 'CH',
            'Italie': 'IT',
            'Espagne': 'ES',
            'Allemagne': 'DE',
            'Royaume-Uni': 'GB',
            'USA': 'US'
        };
        return map[name] || name.substring(0, 2).toUpperCase();
    };

    if (!formData) {
        return (
            <div className="login-container">
                <div className="login-content">
                    <div className="btn" onClick={() => navigate('/register')}>Retour étape 1</div>
                </div>
            </div>
        );
    }

    const countryCodeCode = getCountryCode(formData.country);

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'sepa' && !sepaData.mandateAccepted) {
            alert("Veuillez accepter le mandat de prélèvement SEPA.");
            return;
        }

        setIsLoading(true);

        const identifier = paymentMethod === 'card' ? cardData.number : sepaData.iban;

        try {
            // Verify Payment Uniqueness
            const verifyRes = await fetch(`${API_URL}/auth/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: paymentMethod,
                    identifier: identifier
                })
            });
            const verifyResult = await verifyRes.json();

            if (!verifyResult.valid) {
                // If valid is explicitly false, show message. 
                // If valid is undefined (e.g. 500 error), show error from backend or generic message.
                const msg = verifyResult.message || verifyResult.error || "Erreur inconnue lors de la vérification.";
                alert(msg);
                setIsLoading(false);
                return;
            }


            // Prepare Payload
            let paymentPayload = { ...formData, paymentMethod };

            if (paymentMethod === 'card') {
                const [expMonth, expYear] = cardData.expiry.split('/');
                paymentPayload.cardData = {
                    number: cardData.number.replace(/\s/g, ''),
                    exp_month: parseInt(expMonth, 10),
                    exp_year: parseInt('20' + expYear, 10), // Assuming 2-digit year means 20xx
                    cvc: cardData.cvc
                };
            } else {
                paymentPayload.paymentIdentifier = sepaData.iban;
            }

            // Register User (finalize)
            const registerRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentPayload)
            });

            if (registerRes.ok) {
                alert("Compte créé avec succès !");
                navigate('/login'); // Or dashboard
            } else {
                const err = await registerRes.json();
                alert("Erreur lors de la création : " + (err.error || err.message || "Inconnue"));
            }

        } catch (error) {
            console.error(error);
            alert("Erreur technique: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <header className="header">
            </header>

            <div className="login-content" style={{ maxWidth: '600px', width: '100%' }}>

                {/* Top Logo Section matching image */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f97316',
                        margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)'
                    }}>
                        <img src="/logo.jpg" alt="Logo" style={{ width: '40px', borderRadius: '50%' }} />
                    </div>
                    <h1 style={{ letterSpacing: '4px', fontSize: '1.2rem', fontWeight: 'bold' }}>ARTISANFLOW</h1>
                    <h2 style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '2px', marginTop: '5px', textTransform: 'uppercase' }}>Inscription - Paiement</h2>
                </div>

                <div style={cardStyle}>

                    {/* Top Green Info Box */}
                    <div style={greenBoxStyle}>
                        L'utilisation de l'application est entièrement gratuite jusqu'au 31 août 2026, aucun prélèvement ne sera effectué avant le 1er septembre 2026.
                        Votre inscription vous permet simplement d'activer votre accès dès maintenant, sans aucun frais immédiat. Vous serez bien entendu averti avant tout renouvellement ou prélèvement.
                    </div>

                    <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Mode de paiement</p>

                    {/* Toggle Buttons */}
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                        <div
                            style={tabButtonStyle(paymentMethod === 'card')}
                            onClick={() => setPaymentMethod('card')}
                        >
                            Carte bancaire<br />
                            <span style={{ fontSize: '0.8em', fontWeight: 'normal' }}>(Visa/Mastercard)</span>
                        </div>
                        <div
                            style={tabButtonStyle(paymentMethod === 'sepa')}
                            onClick={() => setPaymentMethod('sepa')}
                        >
                            <br />Prélèvement SEPA
                        </div>
                    </div>

                    <form onSubmit={handleCreateAccount}>

                        {paymentMethod === 'card' && (
                            <>
                                <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>Informations de carte bancaire</p>
                                <div className="form-group">
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Numéro de carte"
                                            value={cardData.number}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                                const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                                setCardData({ ...cardData, number: formatted });
                                            }}
                                            maxLength="19"
                                            required
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>💳</span>
                                        <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontSize: '0.8rem', cursor: 'pointer' }}>Préremplir link</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="MM / AA"
                                            value={cardData.expiry}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                if (val.length >= 3) {
                                                    val = val.slice(0, 2) + '/' + val.slice(2);
                                                }
                                                setCardData({ ...cardData, expiry: val });
                                            }}
                                            maxLength="5"
                                            required
                                            style={{ textAlign: 'center' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="CVC"
                                            value={cardData.cvc}
                                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                                            required
                                            style={{ textAlign: 'center' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ color: '#ccc', fontSize: '0.85rem' }}>Code postal de facturation</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={cardData.zip}
                                        onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
                                        required
                                    />
                                    <small style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginTop: '5px' }}>
                                        Requis pour la vérification AVS (améliore la sécurité et les taux d'acceptation)
                                    </small>
                                </div>
                            </>
                        )}

                        {paymentMethod === 'sepa' && (
                            <>
                                <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '10px' }}>IBAN ({countryCodeCode})</p>
                                <div className="form-group">
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🏦</span>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="BEXX XXXX XXXX XXXX"
                                            value={sepaData.iban}
                                            onChange={(e) => setSepaData({ ...sepaData, iban: e.target.value })}
                                            required
                                            style={{
                                                paddingLeft: '40px',
                                                width: '100%',
                                                textAlign: 'center',
                                                letterSpacing: '1px',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '15px', color: '#fff', fontSize: '0.8rem' }}>
                                    <input
                                        type="checkbox"
                                        id="sepaMandate"
                                        checked={sepaData.mandateAccepted}
                                        onChange={(e) => setSepaData({ ...sepaData, mandateAccepted: e.target.checked })}
                                        style={{ marginTop: '3px' }}
                                        required
                                    />
                                    <label htmlFor="sepaMandate" style={{ cursor: 'pointer', lineHeight: '1.4' }}>
                                        En cochant cette case, j'autorise ArtisanFlow à prélever le montant de mon abonnement via prélèvement SEPA.
                                        Aucun prélèvement ne sera effectué avant le 1er septembre 2026. Je peux annuler ce mandat ou demander un remboursement selon les conditions de ma banque.
                                    </label>
                                </div>
                            </>
                        )}

                        {/* Bottom Green Security Box */}
                        <div style={{ ...greenBoxStyle, marginTop: '25px', marginBottom: '25px' }}>
                            Vos informations de paiement sont entièrement sécurisées et cryptées. Elles ne sont jamais stockées chez nous et sont traitées par un prestataire certifié.
                            Aucun prélèvement ne sera effectué avant le 1er septembre 2026.
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button
                                type="button"
                                onClick={handleBack}
                                style={{
                                    padding: '12px 25px', borderRadius: '30px', border: '1px solid #fff', backgroundColor: 'transparent',
                                    color: '#fff', cursor: 'pointer', minWidth: '100px'
                                }}
                            >
                                Retour
                            </button>

                            <button
                                type="submit"
                                className="btn-primary" // Assuming global class or we style it inline
                                style={{
                                    flex: 1, borderRadius: '30px', padding: '15px', fontWeight: 'bold', fontSize: '1rem',
                                    backgroundColor: '#f97316', border: 'none', color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 0 15px rgba(249, 115, 22, 0.5)'
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <span className="spinner-border" style={{ width: '1rem', height: '1rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                                        Traitement...
                                    </span>
                                ) : "CRÉER MON COMPTE"}
                            </button>
                        </div>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
                        <span style={{ color: '#ccc' }}>Déjà un compte ? </span>
                        <Link to="/login" style={{ color: '#f97316', textDecoration: 'none' }}>Se connecter</Link>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: '#666' }}>
                        <Link to="/" style={{ color: '#f97316', textDecoration: 'none' }}>← Retour à l'accueil</Link>
                        <span style={{ margin: '0 5px' }}>|</span>
                        <span style={{ color: '#888' }}>Mentions légales</span>
                    </div>

                </div>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PaymentPage;
