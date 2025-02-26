import { useState, useEffect } from "react";
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguajeSelector";
import { useTranslation } from "react-i18next";
import "../styles/dashboard/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const Dashboard = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirigir al login después de cerrar sesión
  };

  // Estado para almacenar los sneakers
  const [sneakers, setSneakers] = useState([]);
  const [favorites, setFavorites] = useState([]); // Estado para manejar favoritos

  // Categorías y marcas (objetos con id y nombre)
  const [categories] = useState([
    { id: 1, nombre: "Baloncesto" },
    { id: 2, nombre: "Casuales" },
    { id: 3, nombre: "Deportivas" },
    { id: 4, nombre: "Atletismo" },
    { id: 5, nombre: "Patinaje" },
  ]);
  const [brands] = useState([
    { id: 1, nombre: "Nike" },
    { id: 2, nombre: "Adidas" },
    { id: 3, nombre: "Puma" },
    { id: 4, nombre: "Jordan" },
    { id: 5, nombre: "New Balance" },
  ]);

  // Estados para filtros (almacenamos IDs o cadena vacía para "Todas")
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Función para obtener sneakers según filtros
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
      if (!response.ok) {
        throw new Error("Error en la red");
      }
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
      if (!response.ok) {
        throw new Error("Error en la red");
      }
      const data = await response.json();
      setSneakers(data.sneakers);
    } catch (error) {
      console.error("Error fetching sneakers:", error);
    }
  };

  // Al montar el componente, obtener todas los sneakers
  useEffect(() => {
    fetchAllSneakers();
  }, []);

  // Cada vez que cambian los filtros, se vuelve a obtener la data
  useEffect(() => {
    if (!selectedCategory && !selectedBrand) {
      fetchAllSneakers();
    } else {
      fetchSneakers();
    }
  }, [selectedCategory, selectedBrand]);

  // Función para añadir o quitar un sneaker de favoritos
  const toggleFavorite = (nombre) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(nombre)
        ? prevFavorites.filter((fav) => fav !== nombre)
        : [...prevFavorites, nombre]
    );
  };

  return (
    <div className="containerDashboard">
      <Nav
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="languaje" hidden>
        <LanguageSelector />
      </div>
      <div className="container">
        <div className="titleDashboard">
          <h1>{t("dashboard.title")}</h1>
        </div>
        <div className="row mt-4">
          {/* Se muestra la grilla de sneakers sin el menú lateral */}
          <div className="col-12">
            <div className="grid-container">
              {sneakers && sneakers.length > 0 ? (
                sneakers.map((sneaker) => (
                  <div key={sneaker.nombre} className="card">
                    <div className="image">
                      {sneaker.imagen && (
                        <img
                          src={sneaker.imagen}
                          alt={sneaker.nombre}
                          className="card-img"
                        />
                      )}

                      {/* Ícono de favoritos */}
                      <FaRegHeart
                        className={`heart-icon ${
                          favorites.includes(sneaker.nombre) ? "favorited" : ""
                        }`}
                        onClick={() => toggleFavorite(sneaker.nombre)}
                      />
                    </div>
                    <div className="card-info">
                      <h5>{sneaker.nombre}</h5>
                      <div className="sneakerDates" hidden>
                        <p>{sneaker.descripcion}</p>
                        <p>
                          <strong>Categoría:</strong> {sneaker.categoria}
                        </p>
                        <p>
                          <strong>Marca:</strong> {sneaker.marca}
                        </p>
                        <p>
                          <strong>Modelo:</strong> {sneaker.modelo}
                        </p>
                      </div>
                      {sneaker.precio && (
                        <p className="price">${sneaker.precio}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results text-center">
                  No se encontraron resultados.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="copyright">
          <p class="textCopyright">© 2025 SNEAKERS, Inc. Todos los derechos reservados</p>
        </div>
      </div>
    </div>
            // {user && (
            //   <p>
            //     {t("dashboard.user")}: {user.displayName || user.email}
            //   </p>
            // )}
            // <button onClick={handleLogout} className="btn btn-danger">
            //   {t("dashboard.logout")}
            // </button>
  );
};

export default Dashboard;
