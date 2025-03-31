import { useTranslation } from "react-i18next";

const Footer = () =>{
    
    const { t } = useTranslation();
    
    return(
    <div className="copyright">
        <p className="textCopyright">
        {t("footer.text")}
        </p>
    </div>
    )
}

export default Footer;