import { useState, useEffect } from "react";
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguajeSelector";
import { useTranslation } from "react-i18next";
import "../styles/dashboard/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";

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

    // Categorías y marcas (objetos con id y nombre)
    const [categories] = useState([
        { id: 1, nombre: "Deportivas" },
        { id: 2, nombre: "Casuales" },
        { id: 3, nombre: "Running" },
        { id: 4, nombre: "Basketball" },
        { id: 5, nombre: "Skate" },
    ]);
    const [brands] = useState([
        { id: 1, nombre: "Nike" },
        { id: 2, nombre: "Adidas" },
        { id: 3, nombre: "Puma" },
        { id: 4, nombre: "Reebok" },
        { id: 5, nombre: "New Balance" },
    ]);

    // Estados para filtros (almacenamos IDs o cadena vacía para "Todas")
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");

    // Función para obtener sneakers según filtros
    const fetchSneakers = async () => {
        let endpoint = "http://localhost:3000/api/sneakers";

        if (selectedCategory && selectedBrand) {
            // Endpoint que filtra por categoría y marca
            endpoint = `http://localhost:3000/api/sneakers/ByCategoryAndMarca?category=${selectedCategory}&marca=${selectedBrand}`;
        } else if (selectedCategory) {
            // Endpoint que filtra solo por categoría
            endpoint = `http://localhost:3000/api/sneakers/ByCategory?category=${selectedCategory}`;
        } else if (selectedBrand) {
            // Endpoint que filtra solo por marca
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

    // Al montar el componente, obtener todas las sneakers
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

    return (
        <div className="containerDashboard">
            <Nav></Nav>
            <div className="languaje" hidden>
                <LanguageSelector />
            </div>
            <div className="container">
                <div className="titleDashboard">
                    <h1>{t("dashboard.title")}</h1>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
