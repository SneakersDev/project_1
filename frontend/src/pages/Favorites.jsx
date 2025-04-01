// pages/Favorites.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "../styles/dashboard/dashboard.css"; // Usamos los mismos estilos
import LanguageSelector from "../components/LanguajeSelector";
import AccessibilityButtons from "../components/Accesibility";
import { useTranslation } from "react-i18next";
import "../styles/favorites/favorites.css";
import { IoMdSettings } from "react-icons/io";
import { RiHomeLine } from "react-icons/ri";
import { SiGooglemaps } from "react-icons/si";

const Favorites = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde localStorage al montar el componente
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Función para remover un sneaker de favoritos
  const toggleFavorite = (sneakerId) => {
    const updatedFavorites = favorites.filter(
      (sneaker) => sneaker.id !== sneakerId
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="containerDashboard containerFavorites">
      <div className="home-buttons">
        <Nav showButtons={true} />
      </div>
      <div className="languajeSneaker languajeFavorite">
        <LanguageSelector />
      </div>
      <div className="accesibilitySneaker">
        <AccessibilityButtons />
      </div>
      <div className="container">
        <div className="titleDashboard">
          <h1>{t("favorites.title")}</h1>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            {favorites.length === 0 ? (
              <div className="noResults">
                <p className="no-results">{t("favorites.noFavorites")}</p>
              </div>
            ) : (
              <div className="grid-container">
                {favorites.map((sneaker) => (
                  <div key={sneaker.id} className="card">
                    <div className="image">
                      <Link to={`/sneaker/${sneaker.id}`}>
                        {sneaker.imagen && (
                          <img
                            src={sneaker.imagen}
                            alt={sneaker.nombre}
                            className="card-img"
                          />
                        )}
                      </Link>
                      <FaRegHeart
                        className="heart-icon favorited"
                        onClick={() => toggleFavorite(sneaker.id)}
                      />
                    </div>
                    <div className="card-info">
                      <h5>{sneaker.nombre}</h5>
                      {sneaker.precio && (
                        <p className="price">${sneaker.precio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
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
    </div>
  );
};

export default Favorites;
