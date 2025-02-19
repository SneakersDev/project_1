import React, { useState, useEffect } from "react";
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/LanguajeSelector";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
    const { t } = useTranslation();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/"); // Redirigir al login después de cerrar sesión
    };

    // Estados para almacenar datos de la API y filtros
    const [sneakers, setSneakers] = useState([]);

    // Ahora las categorías y marcas son objetos con id y nombre
    const [categories, setCategories] = useState([
        { id: 1, nombre: "Deportivas" },
        { id: 2, nombre: "Casuales" },
        { id: 3, nombre: "Running" },
        { id: 4, nombre: "Basketball" },
        { id: 5, nombre: "Skate" },
    ]);
    const [brands, setBrands] = useState([
        { id: 1, nombre: "Nike" },
        { id: 2, nombre: "Adidas" },
        { id: 3, nombre: "Puma" },
        { id: 4, nombre: "Reebok" },
        { id: 5, nombre: "New Balance" },
    ]);

    // Estados para filtros (almacenamos IDs, que pueden ser números o cadena vacía)
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");

    // Función para obtener sneakers según filtros usando async/await
    const fetchSneakers = async () => {
        let endpoint = "http://localhost:3000/api/sneakers"; // Endpoint por defecto (todos los sneakers)
        // Si se selecciona solo categoría
        if (selectedCategory && !selectedBrand) {
            endpoint = `http://localhost:3000/api/sneakers/ByCategoria?category=${selectedCategory}`;
        }
        // Si se selecciona solo marca
        else if (selectedBrand && !selectedCategory) {
            endpoint = `http://localhost:3000/api/sneakers/ByMarca?marca=${selectedBrand}`;
        }
        // Si se seleccionan ambos, se opta por obtener todos y filtrar en el cliente
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Error en la red");
            }
            const data = await response.json();
            let results = data.sneakers;

            // Si ambos filtros están seleccionados, se filtran en el cliente usando IDs
            if (selectedCategory && selectedBrand) {
                results = results.filter((sneaker) => sneaker.categoria_id === Number(selectedCategory) && sneaker.marca_id === Number(selectedBrand));
            }
            setSneakers(results);
        } catch (error) {
            console.error("Error fetching sneakers:", error);
        }
    };

    // Función para obtener todos los sneakers
    const fetchAllSneakers = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/sneakers", { 
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include" });
            if (!response.ok) {
                throw new Error("Error en la red");
            }
            const data = await response.json();
            setSneakers(data.sneakers);
        } catch (error) {
            console.error("Error fetching sneakers:", error);
        }
    };

    // Al montar el componente se obtienen todos los sneakers
    useEffect(() => {
        fetchAllSneakers();
    }, []);

    // Cada vez que cambian los filtros, se vuelve a buscar la información
    useEffect(() => {
        if (!selectedCategory && !selectedBrand) {
            fetchAllSneakers();
        } else {
            fetchSneakers();
        }
    }, [selectedCategory, selectedBrand]);

    return (
        <div className="container">
            <LanguageSelector />
            <div className="container mt-5">
                <h1>{t("dashboard.title")}</h1>
                {user && (
                    <p>
                        {t("dashboard.user")}: {user.displayName || user.email}
                    </p>
                )}
                <button onClick={handleLogout} className="btn btn-danger">
                    {t("dashboard.logout")}
                </button>
                <div className="row mt-4">
                    {/* Menú lateral para filtros */}
                    <div className="col-md-3">
                        <h4>Categorías</h4>
                        <select className="form-control" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="">Todas</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        <h4 className="mt-4">Marcas</h4>
                        <select className="form-control" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value="">Todas</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Tabla para mostrar los sneakers */}
                    <div className="col-md-9">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sneakers && sneakers.length > 0 ? (
                                    sneakers.map((sneaker) => (
                                        <tr key={sneaker.id}>
                                            <td>{sneaker.id}</td>
                                            <td>{sneaker.nombre}</td>
                                            <td>{sneaker.categoria}</td>
                                            <td>{sneaker.marca}</td>
                                            <td>{sneaker.modelo}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No se encontraron resultados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
