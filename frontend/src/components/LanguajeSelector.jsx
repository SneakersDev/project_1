import { useState } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n";
import { MdArrowDropDown } from "react-icons/md";
import "../styles/languageSwitcher/languaje.css"


const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectLanguage = (lang) => {
        changeLanguage(lang);
        setIsOpen(false);
    };

    const getLabel = (lang) => {
        switch (lang) {
            case "en":
                return "🇬🇧";
            case "es":
                return "🇪🇸";
            case "fr":
                return "🇫🇷";
            case "de":
                return "🇩🇪";
            default:
                return "";
        }
    };

    return (
        <div className="languajeSelector" style={{ position: "fixed", left: "2rem", top: "1rem" }}>
            <button
                onClick={toggleDropdown}
                className="buttonSelect"
            >
                 {getLabel(i18n.language)}<MdArrowDropDown />
            </button>
            {isOpen && (
                <ul className="listLang"
                >
                    {["en", "es", "fr", "de"].map((lang) => (
                        <li key={lang}>
                            <button
                                onClick={() => selectLanguage(lang)}
                                style={{
                                    padding: "8px 12px",
                                    width: "100%",
                                    textAlign: "left",
                                    border: "none",
                                    background: i18n.language === lang ? "#ff852d" : "transparent",
                                    cursor: "pointer",
                                    color: "black"
                                }}
                            >
                                {getLabel(lang)}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelector;
