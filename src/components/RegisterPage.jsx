import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
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
        // Quebec specific structure handled in render
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
        // No simple TVA intra equivalent often, but using simplified view if needed. 
        // Request didn't specify TVA for US, but "Etats-Unis : EIN". Assuming mostly business ID.
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
    "Horloger", "Informatique", "Installateur Porte de garage & portails", "Installateur VMC", "Installateur de feux",
    "Installateur sanitaire", "Installateur vollets roulants", "Installateur/technicien Pompes à chaleur",
    "Joaillier", "Luthier", "Maçon", "Maroquinier", "Menuisier", "Menuisier Aluminium", "Menuisier PVC", "Mécanicien auto",
    "Mécanicien moto", "Métallier", "Modéliste", "Paysagiste", "Peintre Art & Déco", "Peintre automobile",
    "Peintre en batîment", "Photographe indépendant", "Plaquiste", "Plombier", "Plâtrier", "Potier", "Ramonage",
    "Restaurateur d'Art", "Réparateur machines agricoles", "Sculpteur", "Sellier Maroquinerie", "Sellier automobile",
    "Serrurier", "Solier-Moquetiste", "Soudeur", "Staffeur-ornemaniste", "Tapissier Mural", "Tapissier d'ameublement",
    "Terrassier", "Tisserand", "Tourneur sur bois", "Verrier", "Vidéaste indépendant", "Vitrier", "Zingueur"
].sort((a, b) => a.localeCompare(b));

// Append 'Autre' at the end
const JOBS = [...JOB_LIST, "Autre"];

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
        tva: '',
        businessId: '',
        tvaIntra: '',
        // Quebec specifics
        tvq: '',
        tps: ''
    });

    // Validations
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Input restrictions
        let newValue = value;

        // No letters (Mobile, Street Number)
        if (name === 'mobile' || name === 'number') {
            newValue = value.replace(/[a-zA-Z]/g, '');
        }

        // No numbers (City, Street, Names)
        if (name === 'city' || name === 'street' || name === 'lastName' || name === 'firstName') {
            newValue = value.replace(/[0-9]/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form Data Submitted:", formData);
            // navigate('/register/payment');
        }
    };

    const getCountryConfig = () => {
        return COUNTRIES.find(c => c.label === formData.country) || COUNTRIES[0];
    };

    const currentCountry = getCountryConfig();

    return (
        <div className="login-container">
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

                        {/* 1. Nom de l'entreprise */}
                        <div className="form-group">
                            <label htmlFor="companyName">Nom de l'entreprise</label>
                            <input
                                type="text"
                                name="companyName"
                                id="companyName"
                                className="input-field"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 2. Nom & Prénom du dirigeant */}
                        <div className="row-2-cols">
                            <div className="form-group">
                                <label htmlFor="lastName">Nom du dirigeant</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    className="input-field"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">Prénom du dirigeant</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    className="input-field"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* 3. Email */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 4. Mot de passe */}
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="input-field"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 5. Répéter mot de passe */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Répéter mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="input-field"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 6. Code PIN */}
                        <div className="form-group">
                            <label htmlFor="pin">Code pin (4 chiffres)</label>
                            <input
                                type="text"
                                name="pin"
                                id="pin"
                                maxLength="4"
                                className="input-field"
                                value={formData.pin}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 7. Répéter Code PIN */}
                        <div className="form-group">
                            <label htmlFor="confirmPin">Répéter le code pin</label>
                            <input
                                type="text"
                                name="confirmPin"
                                id="confirmPin"
                                maxLength="4"
                                className="input-field"
                                value={formData.confirmPin}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 8. Pays */}
                        <div className="form-group">
                            <label htmlFor="country">Pays</label>
                            <select
                                name="country"
                                id="country"
                                className="input-field"
                                value={formData.country}
                                onChange={handleChange}
                            >
                                {COUNTRIES.map((c, idx) => (
                                    <option key={idx} value={c.label}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 9. Rue & Numéro */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: '1' }}>
                                <label htmlFor="street">Rue</label>
                                <input
                                    type="text"
                                    name="street"
                                    id="street"
                                    className="input-field"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ width: '100px' }}>
                                <label htmlFor="number">Numéro</label>
                                <input
                                    type="text"
                                    name="number"
                                    id="number"
                                    className="input-field"
                                    value={formData.number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* 10. Boîte & Code Postal */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ width: '100px' }}>
                                <label htmlFor="box">Boîte</label>
                                <input
                                    type="text"
                                    name="box"
                                    id="box"
                                    className="input-field"
                                    value={formData.box}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="zipCode">Code Postal</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    id="zipCode"
                                    className="input-field"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* 11. Ville */}
                        <div className="form-group">
                            <label htmlFor="city">Ville</label>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                className="input-field"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 12. Mobile */}
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile/gsm/Portable</label>
                            <input
                                type="tel"
                                name="mobile"
                                id="mobile"
                                className="input-field"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 13. Métier */}
                        <div className="form-group">
                            <label htmlFor="job">Métier</label>
                            <select
                                name="job"
                                id="job"
                                className="input-field"
                                value={formData.job}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Séléctionner un métier</option>
                                {JOBS.map((job, idx) => (
                                    <option key={idx} value={job}>{job}</option>
                                ))}
                            </select>
                        </div>
                        {formData.job === 'Autre' && (
                            <div className="form-group">
                                <label htmlFor="customJob">Indiquez votre métier</label>
                                <input
                                    type="text"
                                    name="customJob"
                                    id="customJob"
                                    className="input-field"
                                    value={formData.customJob}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {/* 14. Statut TVA */}
                        <div className="form-group">
                            <label>Statut TVA</label>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', color: '#ccc' }}>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="tva"
                                        value="assujetti"
                                        checked={formData.tva === 'assujetti'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span style={{ marginLeft: '8px' }}>Assujetti à la TVA</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="tva"
                                        value="non-assujetti"
                                        checked={formData.tva === 'non-assujetti'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span style={{ marginLeft: '8px' }}>Non Assujetti à la TVA</span>
                                </label>
                            </div>
                        </div>

                        {/* 15. Conditional Business Fields */}
                        {formData.tva && (
                            <>
                                {/* Business ID (always visible if tva selected) */}
                                <div className="form-group">
                                    <label htmlFor="businessId">{currentCountry.businessLabel}</label>
                                    <input
                                        type="text"
                                        name="businessId"
                                        id="businessId"
                                        className="input-field"
                                        value={formData.businessId}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* QUEBEC Specific Fields */}
                                {currentCountry.isQuebec && formData.tva === 'assujetti' && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="tvq">TVQ / QST</label>
                                            <input
                                                type="text"
                                                name="tvq"
                                                id="tvq"
                                                className="input-field"
                                                value={formData.tvq}
                                                onChange={handleChange}
                                            />
                                            <small style={{ display: 'block', marginTop: '5px', color: '#888', fontStyle: 'italic' }}>
                                                Format : 10 chiffres + TQ0001
                                            </small>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="tps">TPS / GST (optionnel)</label>
                                            <input
                                                type="text"
                                                name="tps"
                                                id="tps"
                                                className="input-field"
                                                value={formData.tps}
                                                onChange={handleChange}
                                            />
                                            <small style={{ display: 'block', marginTop: '5px', color: '#888', fontStyle: 'italic' }}>
                                                Numéro TPS fédéral (obligatoire uniquement si votre CA dépasse 30 000 $)
                                            </small>
                                        </div>
                                    </>
                                )}

                                {/* OTHER COUNTRIES TVA Intra */}
                                {!currentCountry.isQuebec && formData.tva === 'assujetti' && currentCountry.tvaLabel && (
                                    <div className="form-group">
                                        <label htmlFor="tvaIntra">{currentCountry.tvaLabel}</label>
                                        <input
                                            type="text"
                                            name="tvaIntra"
                                            id="tvaIntra"
                                            className="input-field"
                                            value={formData.tvaIntra}
                                            onChange={handleChange}
                                        />
                                        {currentCountry.tvaHint && (
                                            <small style={{ display: 'block', marginTop: '5px', color: '#888', fontStyle: 'italic' }}>
                                                {currentCountry.tvaHint}
                                            </small>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        <button type="submit" className="btn btn-primary login-btn">CONTINUER</button>
                    </form>

                    <div className="login-links">
                        <div className="link-row-center mt-2">
                            <span className="text-white-small">Déjà un compte ?</span>
                            <Link to="/login" className="text-orange ml-1">Se connecter</Link>
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

export default RegisterPage;
