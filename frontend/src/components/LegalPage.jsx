import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

const LegalPage = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="legal-page-container">
            {/* Header */}
            <header className="legal-header">
                <div className="legal-brand">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L3 7V12C3 17.52 7.03 22.46 12 23.63C16.97 22.46 21 17.52 21 12V7L12 2Z" />
                    </svg>
                    <h1>ArtisanFlow</h1>
                </div>
                <Link to="/" className="legal-back-link">← Retour à l'accueil</Link>
            </header>

            <div className="legal-content-wrapper">
                {/* Navigation Rapide */}
                <nav className="legal-nav">
                    <h3>Navigation rapide</h3>
                    <ul>
                        <li><a href="#mentions" onClick={(e) => { e.preventDefault(); scrollToSection('mentions'); }}>Mentions Légales</a></li>
                        <li><a href="#cgu" onClick={(e) => { e.preventDefault(); scrollToSection('cgu'); }}>CGU / CGV</a></li>
                        <li><a href="#confidentialite" onClick={(e) => { e.preventDefault(); scrollToSection('confidentialite'); }}>Politique de Confidentialité</a></li>
                    </ul>
                </nav>

                {/* Section 1: Mentions Légales */}
                <section id="mentions" className="legal-section">
                    <h2>Mentions Légales</h2>

                    <div className="legal-subsection">
                        <h3>Éditeur du site</h3>
                        <p><strong>Nom :</strong> ArtisanFlow</p>
                        <p><strong>Statut :</strong> Service B2B en phase de pré-lancement (pré-production)</p>
                        <p><strong>Adresse :</strong> Chaussée de Bruxelles 325/4, 7800 Ath, Belgique</p>
                        <p><strong>Email de contact :</strong> <a href="mailto:sav@artisanflow-appli.com" className="legal-link">sav@artisanflow-appli.com</a></p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Hébergement</h3>
                        <p>L'application est hébergée par Cloudflare.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Objet du site</h3>
                        <p>ArtisanFlow est une application SaaS destinée aux professionnels pour la gestion administrative. La plateforme est actuellement en phase de pré-lancement et aucun prélèvement ne sera effectué avant septembre 2026.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Responsabilité</h3>
                        <p>L'éditeur ne peut être tenu responsable en cas d'interruptions, erreurs ou dommages liés à l'utilisation du service dans sa version de test.</p>
                    </div>
                </section>

                {/* Section 2: CGU / CGV */}
                <section id="cgu" className="legal-section">
                    <h2>Conditions Générales d'Utilisation / Vente</h2>

                    <div className="legal-subsection">
                        <h3>Présentation du service</h3>
                        <p>ArtisanFlow est une application SaaS destinée exclusivement aux professionnels (B2B). Le service est actuellement en phase de pré-lancement.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Prix</h3>
                        <p>Tarif prévu : 19,99 €/mois (France, Belgique, Luxembourg, Espagne, Italie, Allemagne), 21.00 CHF/mois (Suisse), 30.00 CAD/mois (Québec), 17.99 GBP/mois (Royaume-Uni), 21.99 USD/mois (États-Unis).</p>
                        <p>Phase de pré-lancement : aucun débit réel avant le 01/09/2026.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Inscription</h3>
                        <p>L'utilisateur déclare agir en tant qu'entreprise ou professionnel.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Paiement</h3>
                        <p>Les paiements seront gérés par Stripe dès l'ouverture commerciale officielle en septembre 2026.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Résiliation</h3>
                        <p>L'utilisateur pourra résilier son abonnement à tout moment sans frais lorsque les abonnements réels seront activés.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Responsabilité</h3>
                        <p>L'éditeur n'est pas responsable des dommages liés à une mauvaise utilisation du service en phase de test.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Droit applicable</h3>
                        <p>Les présentes conditions sont régies par le droit belge.</p>
                    </div>
                </section>

                {/* Section 3: Politique de Confidentialité */}
                <section id="confidentialite" className="legal-section">
                    <h2>Politique de Confidentialité (RGPD)</h2>

                    <div className="legal-subsection">
                        <h3>Responsable du traitement</h3>
                        <p>ArtisanFlow - <a href="mailto:sav@artisanflow-appli.com" className="legal-link">sav@artisanflow-appli.com</a></p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Statut du service</h3>
                        <p>La plateforme est en phase de pré-lancement. Aucun prélèvement ne sera effectué avant le 1er septembre 2026.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Données collectées</h3>
                        <p>Nom, email, adresse, pays, numéro TVA (si fourni), données de connexion.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Finalité</h3>
                        <p>Accès full complet à toutes les fonctionnalités gratuitement du 1er janvier 2026 au 31 août 2026.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Sous-traitants</h3>
                        <p>Stripe - Cloudflare (hébergement) – conformes RGPD.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Droits des utilisateurs</h3>
                        <p>Accès, rectification, suppression, portabilité. Contact : <a href="mailto:sav@artisanflow-appli.com" className="legal-link">sav@artisanflow-appli.com</a></p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Durée de conservation</h3>
                        <p>Les données sont conservées tant que le compte est actif ou jusqu'à demande de suppression.</p>
                    </div>

                    <div className="legal-subsection">
                        <h3>Sécurité</h3>
                        <p>Des mesures techniques et organisationnelles sont mises en place pour protéger les données.</p>
                    </div>
                </section>

                <footer className="legal-footer">
                    <p>Dernière mise à jour : Novembre 2024</p>
                    <Link to="/" className="footer-back">← Retour à l'accueil</Link>
                </footer>
            </div>
        </div>
    );
};

export default LegalPage;
