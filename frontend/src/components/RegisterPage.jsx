import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import API_URL from '../config';
import './LoginPage.css';

const COUNTRIES = [
    {
        value: 'France',
        label: 'France - 19,99€/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'SIREN',
        tvaLabel: 'TVA Intracommunautaire',
        tvaHint: 'Préfixe FR obligatoire : FR + 11 caractères'
    },
    {
        value: 'Belgique',
        label: 'Belgique - 19,99€/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'Numéro BCE',
        tvaLabel: 'Numéro de TVA',
        tvaHint: 'Préfixe BE obligatoire : BE + 10 chiffres'
    },
    {
        value: 'Luxembourg',
        label: 'Luxembourg - 19,99€/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'Numéro RCS',
        tvaLabel: 'Numéro de TVA',
        tvaHint: 'Préfixe LU obligatoire : LU + 8 chiffres'
    },
    {
        value: 'Suisse',
        label: 'Suisse - 21.00CHF/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'IDE / UID',
        tvaLabel: 'Numéro de TVA',
        tvaHint: 'Préfixe CHE obligatoire : CHE-XXX.XXX.XXX TVA'
    },
    {
        value: 'Québec',
        label: 'Québec - 30.00 CAD/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'NEQ',
        isQuebec: true
    },
    {
        value: 'Espagne',
        label: 'Espagne- 19,99€/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'NIF / CIF',
        tvaLabel: 'Número de IVA',
        tvaHint: 'Préfixe ES obligatoire'
    },
    {
        value: 'Italie',
        label: 'Italie - 19,99€/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'Codice Fiscale / P.IVA',
        tvaLabel: 'Partita IVA',
        tvaHint: 'Préfixe IT facultatif mais recommandé : IT + 11 chiffres'
    },
    {
        value: 'Allemagne',
        label: 'Allemagne - 19,99€/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'Handelsregisternummer (HRB)',
        tvaLabel: 'USt-IdNr',
        tvaHint: 'Préfixe DE facultatif mais recommandé : DE + 9 chiffres'
    },
    {
        value: 'Royaume-Unis',
        label: 'Royaume-Unis - 17,99GB/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'Company Number',
        tvaLabel: 'VAT Number',
        tvaHint: 'Préfixe GB facultatif'
    },
    {
        value: 'Etats-Unis',
        label: 'Etats-Unis - 21.99 USD/mois * GRATUIT jusqu\'au 31/08/2026',
        businessLabel: 'EIN (Employer Identification Number)',
    }
];

const JOB_LIST = [
    "Agenceur d'intérieur", "Aménageur extérieur", "Arboriste", "Architecte", "Artisan Cuir", "Artisan Upcycling",
    "Bijoutier", "Brodeur", "Carreleur", "Carrossier", "Céramiste", "Coffreur", "Constructeur Ossature Bois",
    "Cordonnier", "Coutelier", "Couturier indépendant", "Créateur en bois", "Créateur en Métal", "Cuisiniste",
    "Débosselage sans peinture", "Débroussailleur, jardiner", "Démolissage (Entreprise de)", "Dépanneur", "Dépanneur électro",
    "Dératisation", "Désinsectisation", "Domotique", "Ebeniste", "Elagueur", "Electricien IRVE", "Electricien auto",
    "Electricien batîment", "Entrepreneur batîment", "Entretien Feux", "Fabricant Luminaires artisanaux",
    "Fabriquant meubles", "Fabriquant textiles", "Ferronnier", "Ferronnier d'art", "Forgeron", "Graphiste", "Graveur",
    "Horloger", "Imprimeur", "Informaticien (dépannage)", "Jardinier",
    "Joaillier", "Luthier", "Maçon", "Maroquinier", "Menuisier", "Menuisier Aluminium", "Menuisier PVC", "Mécanicien auto",
    "Mécanicien moto", "Métallier", "Modéliste", "Paysagiste", "Peintre Art & Déco", "Peintre automobile",
    "Peintre en batîment", "Photographe indépendant", "Plaquiste", "Plombier", "Plâtrier", "Potier", "Ramonage",
    "Restaurateur d'Art", "Réparateur machines agricoles", "Sculpteur", "Sellier Maroquinerie", "Sellier automobile",
    "Serrurier", "Solier-Moquetiste", "Soudeur", "Staffeur-ornemaniste", "Tapissier Mural", "Tapissier d'ameublement",
    "Terrassier", "Tisserand", "Tourneur sur bois", "Verrier", "Vidéaste indépendant", "Vitrier", "Zingueur"
].sort((a, b) => a.localeCompare(b));

const JOBS = [...JOB_LIST, "Autre"];

const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const savedState = location.state?.formData;

    const [formData, setFormData] = useState(savedState || {
        companyName: '',
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
        pin: '',
        confirmPin: '',
        country: 'France - 19,99€/mois * GRATUIT jusqu\'au 31/08/2026',
        street: '',
        number: '',
        box: '',
        zipCode: '',
        city: '',
        mobile: '',
        job: '',
        customJob: '',
        tva: 'assujetti',
        businessId: '',
        tvaIntra: '',
        tvq: '',
        tps: ''
    });

    // ... (imports remain)

    const [isVerifying, setIsVerifying] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const validateForm = () => {
        if (!formData.lastName || !formData.firstName || !formData.email || !formData.password ||
            !formData.pin || !formData.street || !formData.number || !formData.zipCode ||
            !formData.city || !formData.mobile || !formData.job || !formData.tva) {
            alert("Tous les champs sont obligatoires (sauf l'entreprise et la boîte).");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return false;
        }
        if (formData.pin !== formData.confirmPin) {
            alert("Les codes PIN ne correspondent pas.");
            return false;
        }
        if (!formData.email.includes('@')) {
            alert("L'adresse email doit contenir un '@'.");
            return false;
        }
        if (formData.job === 'Autre' && !formData.customJob) {
            alert("Veuillez indiquer votre métier.");
            return false;
        }
        return true;
    };

    // Helper for mobile placeholder based on country
    const getMobilePlaceholder = (country) => {
        if (!country) return '';
        if (country.includes('France')) return '+33 6 00 00 00 00';
        if (country.includes('Belgique')) return '+32 400 00 00 00';
        if (country.includes('Luxembourg')) return '+352 600 00 00 00';
        if (country.includes('Suisse')) return '+41 70 000 00 00';
        if (country.includes('Espagne')) return '+34 600 00 00 00';
        if (country.includes('Italie')) return '+39 300 000 0000';
        if (country.includes('Allemagne')) return '+49 150 00000000';
        if (country.includes('Royaume-Uni')) return '+44 7000 000000';
        if (country.includes('USA')) return '+1 555-555-5555';
        if (country.includes('Canada')) return '+1 555-555-5555';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'mobile' || name === 'number') {
            newValue = value.replace(/[a-zA-Z]/g, '');
        }

        if (name === 'city' || name === 'street' || name === 'lastName' || name === 'firstName') {
            newValue = value.replace(/[0-9]/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Validation of presence logic retained if needed, OR relaxed as requested
            // User requested "supprimer ... la vérification VIES et UK" and show popup instead.
            // But we might still want to ensure they typed *something* if field is visible?
            // Let's keep basic presence check but remove the API call.

            let idToCheck = formData.tvaIntra;
            if (formData.tva === 'non-assujetti') {
                idToCheck = formData.businessId;
            }

            if (formData.tva === 'assujetti' && !idToCheck) {
                alert("Veuillez renseigner votre numéro de TVA.");
                return;
            }
            if (formData.tva === 'non-assujetti' && !idToCheck && formData.country !== 'Etats-Unis') {
                alert("Veuillez renseigner votre numéro d'entreprise.");
                return;
            }

            // INSTEAD of calling API, show the Modal
            setShowModal(true);
        }
    };

    const handleModalConfirm = () => {
        setShowModal(false);
        navigate('/register/payment', { state: { formData } });
    };

    const getCountryConfig = () => {
        return COUNTRIES.find(c => c.label === formData.country) || COUNTRIES[0];
    };

    const currentCountry = getCountryConfig();

    return (
        <div className="login-container">
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
                        maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto',
                        color: '#333', textAlign: 'left', fontFamily: 'Arial, sans-serif'
                    }}>
                        <h2 style={{ color: '#E85D04', marginBottom: '20px', textAlign: 'center' }}>Cher(ère) Artisan,</h2>

                        <p>Afin de garantir la conformité et la validité de vos documents officiels, nous procédons actuellement à la vérification de votre numéro d'entreprise et/ou numéro de TVA.</p>

                        <p>Cette étape est cruciale, car ces identifiants sont automatiquement intégrés dans tous les devis et factures générés par Artisanflow pour vos clients. Profitez pleinement de l'Application.</p>

                        <p>Pendant cette courte période de vérification, vous avez déjà pleinement accès à toutes les fonctionnalités d'Artisanflow. Vous pouvez commencer immédiatement à créer vos premiers clients, organiser vos chantiers et préparer vos premiers documents !</p>

                        <h4 style={{ marginTop: '20px', color: '#E85D04' }}>⏱️ Processus de Vérification et Suites</h4>

                        <p><strong>Vérification Réussie (sous 24h) :</strong> Si toutes les informations sont validées, vous ne recevrez aucune notification de notre part. Votre compte restera actif et prêt à générer des documents légalement conformes.</p>

                        <p><strong>Correction Requise :</strong> En cas d'incohérence ou d'erreur détectée, un email vous sera immédiatement envoyé. Vous pourrez alors accéder à vos paramètres pour effectuer la modification ou la correction nécessaire sans délai.</p>

                        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Nous vous remercions de votre collaboration. La fiabilité de vos documents est notre priorité.</p>

                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <button onClick={handleModalConfirm} className="btn btn-primary" style={{ backgroundColor: '#E85D04', border: 'none', padding: '10px 30px', fontSize: '1.1rem' }}>
                                OK J'AI COMPRIS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="header">
                <div className="lang-wrapper">
                    <LanguageSelector />
                </div>
            </header>

            <div className="login-content" style={{ maxWidth: '600px' }}>
                <div className="logo-section">
                    <img src="/logo.jpg" alt="ArtisanFlow Logo" className="login-logo" />
                    <h1 className="brand-title-small">ARTISANFLOW</h1>
                    <h2 className="page-subtitle">INSCRIPTION</h2>
                </div>

                <div className="login-card">
                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="companyName">Nom de l'entreprise</label>
                            <input type="text" name="companyName" id="companyName" className="input-field" value={formData.companyName} onChange={handleChange} />
                        </div>

                        <div className="row-2-cols">
                            <div className="form-group">
                                <label htmlFor="lastName">Nom du dirigeant</label>
                                <input type="text" name="lastName" id="lastName" className="input-field" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">Prénom du dirigeant</label>
                                <input type="text" name="firstName" id="firstName" className="input-field" value={formData.firstName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" className="input-field" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" name="password" id="password" className="input-field" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Répéter mot de passe</label>
                            <input type="password" name="confirmPassword" id="confirmPassword" className="input-field" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pin">Code pin (4 chiffres)</label>
                            <input type="password" name="pin" id="pin" maxLength="4" className="input-field" value={formData.pin} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPin">Répéter le code pin</label>
                            <input type="password" name="confirmPin" id="confirmPin" maxLength="4" className="input-field" value={formData.confirmPin} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Pays</label>
                            <select name="country" id="country" className="input-field" value={formData.country} onChange={handleChange}>
                                {COUNTRIES.map((c, idx) => (
                                    <option key={idx} value={c.label}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: '1' }}>
                                <label htmlFor="street">Rue</label>
                                <input type="text" name="street" id="street" className="input-field" value={formData.street} onChange={handleChange} required />
                            </div>
                            <div className="form-group" style={{ width: '100px' }}>
                                <label htmlFor="number">Numéro</label>
                                <input type="text" name="number" id="number" className="input-field" value={formData.number} onChange={handleChange} required />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ width: '100px' }}>
                                <label htmlFor="box">Boîte</label>
                                <input type="text" name="box" id="box" className="input-field" value={formData.box} onChange={handleChange} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="zipCode">Code Postal</label>
                                <input type="text" name="zipCode" id="zipCode" className="input-field" value={formData.zipCode} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">Ville</label>
                            <input type="text" name="city" id="city" className="input-field" value={formData.city} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile">Mobile / GSM / Portable</label>
                            <input
                                type="text"
                                name="mobile"
                                id="mobile"
                                className="input-field"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder={getMobilePlaceholder(formData.country)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="job">Métier</label>
                            <select name="job" id="job" className="input-field" value={formData.job} onChange={handleChange} required>
                                <option value="">Séléctionner un métier</option>
                                {JOBS.map((job, idx) => (
                                    <option key={idx} value={job}>{job}</option>
                                ))}
                            </select>
                        </div>
                        {formData.job === 'Autre' && (
                            <div className="form-group">
                                <label htmlFor="customJob">Indiquez votre métier</label>
                                <input type="text" name="customJob" id="customJob" className="input-field" value={formData.customJob} onChange={handleChange} required />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Statut TVA</label>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', color: '#ccc' }}>
                                <label className="radio-label">
                                    <input type="radio" name="tva" value="assujetti" checked={formData.tva === 'assujetti'} onChange={handleChange} required />
                                    <span style={{ marginLeft: '8px' }}>Assujetti à la TVA</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="tva" value="non-assujetti" checked={formData.tva === 'non-assujetti'} onChange={handleChange} required />
                                    <span style={{ marginLeft: '8px' }}>Non Assujetti à la TVA</span>
                                </label>
                            </div>
                        </div>

                        {formData.tva && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="businessId">{currentCountry.businessLabel}</label>
                                    <input type="text" name="businessId" id="businessId" className="input-field" value={formData.businessId} onChange={handleChange} />
                                </div>

                                {currentCountry.isQuebec && formData.tva === 'assujetti' && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="tvq">TVQ / QST</label>
                                            <input type="text" name="tvq" id="tvq" className="input-field" value={formData.tvq} onChange={handleChange} />
                                            <small style={{ display: 'block', marginTop: '5px', color: '#888', fontStyle: 'italic' }}>Format : 10 chiffres + TQ0001</small>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="tps">TPS / GST (optionnel)</label>
                                            <input type="text" name="tps" id="tps" className="input-field" value={formData.tps} onChange={handleChange} />
                                            <small style={{ display: 'block', marginTop: '5px', color: '#888', fontStyle: 'italic' }}>Numéro TPS fédéral (obligatoire uniquement si votre CA dépasse 30 000 $)</small>
                                        </div>
                                    </>
                                )}

                                {!currentCountry.isQuebec && formData.tva === 'assujetti' && currentCountry.tvaLabel && (
                                    <div className="form-group">
                                        <label htmlFor="tvaIntra">{currentCountry.tvaLabel}</label>
                                        <input type="text" name="tvaIntra" id="tvaIntra" className="input-field" value={formData.tvaIntra} onChange={handleChange} />
                                        {currentCountry.tvaHint && (
                                            <small style={{ display: 'block', marginTop: '5px', color: '#888', fontStyle: 'italic' }}>{currentCountry.tvaHint}</small>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        <button type="submit" className="btn btn-primary login-btn" disabled={isVerifying}>
                            CONTINUER
                        </button>
                    </form>

                    <div className="login-links">
                        <div className="link-row-center mt-2">
                            <span className="text-white-small">Déjà un compte ?</span>
                            <Link to="/login" className="text-orange ml-1">Se connecter</Link>
                        </div>
                        <div className="link-row-center mt-3">
                            <Link to="/" className="text-orange">← Retour à l'accueil</Link>
                            <span className="separator">|</span>
                            <span className="text-orange">Mentions légales</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
