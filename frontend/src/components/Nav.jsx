// components/Nav.jsx
import React from "react";
import { TiThMenu } from "react-icons/ti";
import { LuUserRound } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { RiHomeLine } from "react-icons/ri";
import { SiGooglemaps } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/nav/nav.css";
import { IoMdSettings } from "react-icons/io";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Nav = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  showHomeOnly,
  showButtons
}) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (showHomeOnly) {
    return (
      <div className="nav-wrapper">
        <div className="nav-bottom">
          <div className="nav-bottom-right">
            <div className="home">
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary"
                aria-label="Abrir la sección principal"
              >
                <RiHomeLine />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(showButtons){
    return (
      <div className="nav-wrapper">
        <div className="nav-bottom">
          <div className="nav-bottom-left sneakers">
            <div className="favorites">
              <button
                onClick={() => navigate("/favorites")}
                className="btn btn-primary"
                aria-label="Abrir la sección de favoritos"
              >
                <FaRegHeart />
              </button>
            </div>
            <div className="user">
              <button
                onClick={() => navigate("/user")}
                className="btn btn-primary"
                aria-label="Abrir la sección del usuario"
              >
                <LuUserRound />
              </button>
            </div>
          </div>
          <div className="nav-bottom-right">
            <div className="home">
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary"
                aria-label="Abrir la sección principal"
              >
                <RiHomeLine />
              </button>
            </div>
            <div className="maps">
              <button
                onClick={() => navigate("/Map")}
                className="btn btn-primary"
                aria-label="Abrir el mapa"
              >
                <SiGooglemaps />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nav-wrapper">
      {/* Sección superior: menú y buscador */}
      <div className="nav-top">
        <div className="menu">
          <p className="d-inline-flex gap-1">
            <button
              className="btn btn-primary"
              data-bs-toggle="collapse"
              data-bs-target="#multiCollapseExample1"
              aria-expanded="false"
              aria-controls="multiCollapseExample1"
              aria-label="Abrir menú"
            >
              <TiThMenu />
            </button>
          </p>
          <div className="collapse multi-collapse" id="multiCollapseExample1">
            <div className="titleCategory">
              <h4>Categorías</h4>
            </div>
            <div className="card card-body">
              <ul className="category-list">
                <li
                  key="general"
                  className={`category-item ${
                    selectedCategory === "" ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory("")}
                >
                  General
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={`category-item ${
                      selectedCategory === cat.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Aquí se integra el SearchBar */}
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Sección inferior (fija) */}
      <div className="nav-bottom">
        <div className="nav-bottom-left">
          <div className="favorites">
            <button
              onClick={() => navigate("/favorites")}
              className="btn btn-primary"
              aria-label="Abrir la sección de favoritos"
            >
              <FaRegHeart />
            </button>
          </div>
          <div className="user">
            <button
              onClick={() => navigate("/user")}
              className="btn btn-primary"
              aria-label="Abrir la sección del usuario"
            >
              <LuUserRound />
            </button>
          </div>
        </div>
        <div className="nav-bottom-right">
          <div className="home">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary"
              aria-label="Abrir la sección principal"
            >
              <RiHomeLine />
            </button>
          </div>
          <div className="maps">
            <button
              onClick={() => navigate("/Map")}
              className="btn btn-primary"
              aria-label="Abrir el mapa"
            >
              <SiGooglemaps />
            </button>
          </div>
        </div>
      </div>
      {/*Botón General para todos los botones*/}
      <div className="mobile-nav">
        {/*Botón para abrir las cateogorías de la página */}
        <button
          className="btn btn-primary btnModalMobile"
          data-bs-toggle="modal"
          data-bs-target="#categoriesModal"
          aria-label="Abrir menú"
        >
          <TiThMenu />
        </button>

        {/* Botón para abrir el modal con búsqueda, favoritos, usuario y mapas */}
        <button
          className="btn btn-primary mobile-modal"
          data-bs-toggle="modal"
          data-bs-target="#mobileOptionsModal"
          aria-label="Más opciones"
        >
          <IoMdSettings />
        </button>
      </div>
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
                Herramientas
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {/* Barra de búsqueda */}
              <div className="modal-search mb-3">
                <SearchBar onSearch={onSearch} alwaysActive />
              </div>
              <hr />
              {/* Botones de favoritos, usuario y mapa */}
              <div className="buttonsMobile">
                <p className="textMobile">
                  Navega por las secciones de la página:
                </p>
                <button
                  onClick={() => navigate("/favorites")}
                  className="btn btn-primary btnMobiles"
                  aria-label="Favoritos"
                >
                  Favoritos <FaRegHeart />
                </button>
                <hr />
                <button
                  onClick={() => navigate("/Map")}
                  className="btn btn-primary btnMobiles"
                  aria-label="Mapa"
                >
                  Localización <SiGooglemaps />
                </button>
                <hr />
                <button
                  onClick={() => navigate("/user")}
                  className="btn btn-primary btnMobiles"
                  aria-label="Usuario"
                >
                  Usuario <LuUserRound />
                </button>
              </div>
            </div>
            <div className="modal-footer">
              {user && (
                <button
                  onClick={handleLogout}
                  className="logout-button mobileLogout"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/*Sección de Categorías para los dispositivos pequeños*/}
      <div
        className="modal fade"
        id="categoriesModal"
        tabIndex="-1"
        aria-labelledby="categoriesModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog categoryModal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="categoriesModalLabel">
                Categorías
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="category-list">
                <li
                  key="general"
                  className={`category-item ${
                    selectedCategory === "" ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory("")}
                  data-bs-dismiss="modal"
                >
                  General
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={`category-item ${
                      selectedCategory === cat.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                    data-bs-dismiss="modal"
                  >
                    {cat.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
