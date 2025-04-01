import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { RiHomeLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import "../styles/user/userProfile.css";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguajeSelector";
import AccessibilityButtons from "../components/Accesibility";

const User = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.assign("/"); // Recarga la página al cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="containerDashboard">
      <div className="home-button">
        <Nav showHomeOnly={true} />
      </div>
      <div className="languajeUser">
        <LanguageSelector />
      </div>
      <div className="accesibilityUser">
          <AccessibilityButtons />
      </div>
      <div className="container">
        <div className="user-container">
          <div className="user-image">
            <AiOutlineUser className="user-icon" />
          </div>
          <div className="user-info">
            <label htmlFor="user" className="user-text">
              {t("user.userLabel")}
            </label>
            <input
              type="text"
              value={user ? user.displayName || user.email : "Invitado"}
              readOnly
              className="user-input"
              disabled
              id="user"
            />
          </div>
          {user && (
            <button onClick={handleLogout} className="logout-button">
              {t("user.logout")}
            </button>
          )}
        </div>
      </div>
      {/* Mobile Nav (Visible solo en ciertas resoluciones) */}
      <div className="mobile-nav userMobile">
        <button
          className="btn btn-primary mobile-modal"
          data-bs-toggle="modal"
          data-bs-target="#mobileOptionsModal"
          aria-label={t("user.moreOptions")}
        >
          <IoMdSettings />
        </button>
      </div>

      {/* Modal con herramientas adicionales */}
      <div
        className="modal fade"
        id="mobileOptionsModal"
        tabIndex="-1"
        aria-labelledby="mobileOptionsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="mobileOptionsModalLabel">
                {t("user.tools")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label={t("user.close")}
              ></button>
            </div>
            <div className="modal-body">
              <div className="buttonsMobile">
                <p className="textMobile">{t("user.navigateSections")}</p>
                <button
                  onClick={() => window.location.assign("/dashboard")}
                  className="btn btn-primary btnMobiles"
                  aria-label={t("user.home")}
                >
                  {t("user.home")} <RiHomeLine />
                </button>
                <hr />
                <button
                  onClick={() => window.location.assign("/favorites")}
                  className="btn btn-primary btnMobiles"
                  aria-label={t("user.favorites")}
                >
                  {t("user.favorites")} <FaRegHeart />
                </button>
                <hr />
                <button
                  onClick={() => window.location.assign("/Map")}
                  className="btn btn-primary btnMobiles"
                  aria-label={t("user.location")}
                >
                  {t("user.location")} <SiGooglemaps />
                </button>
              </div>
              <hr />
              <div className="languajeMobile">
                <p className="Idiom">{t("nav.idiom")}</p>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default User;
