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
        <div className="languajeSelector" style={{ position: "fixed", left: "4rem", top: "2rem" }}>
            <button
                onClick={toggleDropdown}
                style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    background: "#636363",
                    color: "black",
                    fontWeight: "900",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "1.5rem"
                }}
            >
                 {getLabel(i18n.language)}<MdArrowDropDown />
            </button>
            {isOpen && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        background: "#fff",
                        borderRadius: "4px",
                        width: "100%",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        zIndex: 1000,
                    }}
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
