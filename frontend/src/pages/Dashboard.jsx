// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import LanguageSelector from "../components/LanguajeSelector";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../styles/dashboard/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";
import { FaRegHeart } from "react-icons/fa";
import Footer from "../components/Footer";
import AccessibilityButtons from "../components/Accesibility";

const API_URL = "http://localhost:3000";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirigir al login después de cerrar sesión
  };

  // Estado para almacenar los sneakers y favoritos
  const [sneakers, setSneakers] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Intenta leer los favoritos desde localStorage al montar el componente
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  // NUEVO: Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);
  const [brands] = useState([
    { id: 1, nombre: "Nike" },
    { id: 2, nombre: "Adidas" },
    { id: 3, nombre: "Puma" },
    { id: 4, nombre: "Jordan" },
    { id: 5, nombre: "New Balance" },
  ]);

  // Actualiza las categorías cada vez que cambia el idioma
  useEffect(() => {
    setCategories([
      { id: 1, nombre: t("categories.basketball") },
      { id: 2, nombre: t("categories.casual") },
      { id: 3, nombre: t("categories.sports") },
      { id: 4, nombre: t("categories.athletics") },
      { id: 5, nombre: t("categories.skating") },
    ]);
  }, [i18n.language, t]);

  // Estados para filtros de categorías y marcas
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Función para obtener sneakers según filtros de categoría/marca
  const fetchSneakers = async () => {
    let endpoint = "http://localhost:3000/api/sneakers";

    if (selectedCategory && selectedBrand) {
      endpoint = `http://localhost:3000/api/sneakers/ByCategoryAndMarca?category=${selectedCategory}&marca=${selectedBrand}`;
    } else if (selectedCategory) {
      endpoint = `http://localhost:3000/api/sneakers/ByCategory?category=${selectedCategory}`;
    } else if (selectedBrand) {
      endpoint = `http://localhost:3000/api/sneakers/ByMarca?marca=${selectedBrand}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error en la red");
      const data = await response.json();
      setSneakers(data.sneakers);
    } catch (error) {
      console.error("Error fetching sneakers:", error);
    }
  };

  // Función para obtener todos los sneakers
  const fetchAllSneakers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sneakers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error en la red");
      const data = await response.json();
      setSneakers(data.sneakers);
    } catch (error) {
      console.error("Error fetching sneakers:", error);
    }
  };

  // Función para buscar sneakers por nombre (búsqueda parcial, sin distinción de mayúsculas)
  const fetchSneakersByName = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/sneakers/search?name=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Error en la red");
      const data = await response.json();
      setSneakers(data.sneakers);
    } catch (error) {
      console.error("Error fetching sneakers by name:", error);
    }
  };

  // Al montar el componente, obtener todos los sneakers
  useEffect(() => {
    fetchAllSneakers();
  }, []);

  // Actualizar sneakers al cambiar filtros de categoría o marca
  useEffect(() => {
    if (!selectedCategory && !selectedBrand) {
      fetchAllSneakers();
    } else {
      fetchSneakers();
    }
  }, [selectedCategory, selectedBrand]);

  // Efecto para la búsqueda en tiempo real (con debounce de 300ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchAllSneakers();
      } else {
        fetchSneakersByName();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const toggleFavorite = (sneaker) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === sneaker.id)) {
      // Remueve el sneaker de favoritos
      updatedFavorites = favorites.filter((fav) => fav.id !== sneaker.id);
    } else {
      // Agrega el sneaker a favoritos
      updatedFavorites = [...favorites, sneaker];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="containerDashboard">
      <Nav
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSearch={setSearchTerm} // Se pasa la función para actualizar searchTerm
      />
      <div className="languajeDashboard">
        <LanguageSelector />
      </div>
      <div className="accesibility">
        <AccessibilityButtons />
      </div>
      <div className="container">
        <div className="titleDashboard">
          <h1>{t("dashboard.title")}</h1>
        </div>
        <div className="row mt-4">
          {/* Se muestra la grilla de sneakers sin el menú lateral */}
          <div className="col-12">
            {/* Mostrar mensaje de "No se encontraron resultados" fuera del grid-container */}
            {sneakers && sneakers.length === 0 && (
              <div className="noResults">
                <p className="no-results"> {t("categories.noCoincide")}</p>
              </div>
            )}

            <div className="grid-container">
              {sneakers &&
                sneakers.length > 0 &&
                sneakers.map((sneaker) => (
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

                      {/* Asegúrate de pasar el objeto completo */}
                      <FaRegHeart
                        className={`heart-icon ${
                          favorites.some((fav) => fav.id === sneaker.id)
                            ? "favorited"
                            : ""
                        }`}
                        onClick={() => toggleFavorite(sneaker)}
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
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
