// Importa la función `useTranslation` de `react-i18next` para manejar la traducción
import { useTranslation } from "react-i18next";
// Importa la función `changeLanguage` para cambiar el idioma dinámicamente
import { changeLanguage } from "../i18n";

// Define el componente `LanguageSelector`
const LanguageSelector = () => {
    const { i18n } = useTranslation();

    return (
        <div className="btn-group mb-3">
            <button onClick={() => changeLanguage("en")} className={`btn ${i18n.language === "en" ? "btn-primary" : "btn-outline-secondary"}`}>
                🇬🇧 EN
            </button>
            <button onClick={() => changeLanguage("es")} className={`btn ${i18n.language === "es" ? "btn-primary" : "btn-outline-secondary"}`}>
                🇪🇸 ES
            </button>
            <button onClick={() => changeLanguage("fr")} className={`btn ${i18n.language === "fr" ? "btn-primary" : "btn-outline-secondary"}`}>
                🇫🇷 FR
            </button>
        </div>
    );
};

export default LanguageSelector;
