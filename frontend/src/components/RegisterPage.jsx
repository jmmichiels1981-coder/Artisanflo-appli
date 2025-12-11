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

    // Contact Form State
    const [showContactModal, setShowContactModal] = useState(false);
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
                setShowContactModal(false);
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

        export default RegisterPage;
