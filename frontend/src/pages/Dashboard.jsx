import { useState, useEffect } from "react";
import LanguageSelector from "../components/LanguajeSelector";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../styles/dashboard/dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import Footer from "../components/Footer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebase";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const Dashboard = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [sneakers, setSneakers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const navigate = useNavigate();

  const categories = [
    { id: 1, nombre: "Baloncesto" },
    { id: 2, nombre: "Casuales" },
    { id: 3, nombre: "Deportivas" },
    { id: 4, nombre: "Atletismo" },
    { id: 5, nombre: "Patinaje" },
  ];

  const brands = [
    { id: 1, nombre: "Nike" },
    { id: 2, nombre: "Adidas" },
    { id: 3, nombre: "Puma" },
    { id: 4, nombre: "Jordan" },
    { id: 5, nombre: "New Balance" },
  ];

  useEffect(() => {
    fetchAllSneakers();
  }, []);

  const fetchAllSneakers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sneakers`);
      if (!response.ok) throw new Error("Error en la red");
      const data = await response.json();
      setSneakers(data.sneakers);
    } catch (error) {
      console.error("Error fetching sneakers:", error);
    }
  };

  const handleChat = (producto) => {
    setSelectedProduct(producto);
    setShowChat(true);
  };

  const enviarPregunta = async () => {
    if (!pregunta) return;
    try {
      const response = await axios.post(`${API_URL}/api/chatbot`, {
        pregunta,
        product_id: selectedProduct.id,
      });
      setRespuesta(response.data.respuesta || "No se obtuvo respuesta");
    } catch (error) {
      setRespuesta("Error al comunicarse con el chatbot");
    }
  };

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
        onSearch={setSearchTerm}
      />

      <div className="languaje" hidden>
        <LanguageSelector />
      </div>

      <div className="container">
        <div className="titleDashboard">
          <h1>{t("dashboard.title")}</h1>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            {sneakers.length === 0 && (
              <div className="noResults">
                <p className="no-results">No se encontraron resultados.</p>
              </div>
            )}

            <div className="grid-container">
              {sneakers.map((sneaker) => (
                <div key={sneaker.nombre} className="card">
                  <div className="image">
                    {sneaker.imagen && (
                      <img
                        src={sneaker.imagen}
                        alt={sneaker.nombre}
                        className="card-img"
                      />
                    )}
                    <FaRegHeart
                      className={`heart-icon ${
                        favorites.includes(sneaker.nombre) ? "favorited" : ""
                      }`}
                      onClick={() => toggleFavorite(sneaker.nombre)}
                    />
                    <Button variant="primary" onClick={() => handleChat(sneaker)}>
                      Preguntar al Chatbot
                    </Button>
                  </div>
                  <div className="card-info">
                    <h5>{sneaker.nombre}</h5>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      <Modal show={showChat} onHide={() => setShowChat(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chatbot - {selectedProduct?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Haz una pregunta sobre este producto:</Form.Label>
              <Form.Control
                type="text"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={enviarPregunta}>
              Enviar
            </Button>
          </Form>
          <p className="mt-3"><strong>Respuesta:</strong> {respuesta}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
