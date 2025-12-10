import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelector.css';

const languages = [
    { code: 'fr', name: 'Français', flag: 'fr' },
    { code: 'en', name: 'English', flag: 'gb' }, // Using GB flag for English as per user image style
    { code: 'de', name: 'Deutsch', flag: 'de' },
    { code: 'it', name: 'Italiano', flag: 'it' },
    { code: 'es', name: 'Español', flag: 'es' },
    { code: 'nl', name: 'Nederlands', flag: 'nl' }
];

const LanguageSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setIsOpen(false);
        // Here you would typically also update global state or i18n context
    };

    return (
        <div className="language-selector-container" ref={dropdownRef}>
            <button
                className="language-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className="globe-icon">🌐</span>
                <span>{selectedLang.name}</span>
                <span className="arrow-icon">{isOpen ? '▴' : '▾'}</span>
            </button>

            {isOpen && (
                <div className="dropdown-menu" role="listbox">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className={`dropdown-item ${selectedLang.code === lang.code ? 'selected' : ''}`}
                            onClick={() => handleLanguageSelect(lang)}
                            role="option"
                            aria-selected={selectedLang.code === lang.code}
                        >
                            <img
                                src={`https://flagcdn.com/w40/${lang.flag}.png`}
                                alt={`${lang.name} flag`}
                                className="flag-icon"
                            />
                            <span>{lang.name}</span>
                            {selectedLang.code === lang.code && <span className="check-mark">✓</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
