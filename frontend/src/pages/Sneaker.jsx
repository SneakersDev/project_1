import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

import "../styles/sneaker/sneaker.css";

const API_URL = "http://localhost:3000";


function Sneaker() {
    const { id } = useParams();
    const [sneaker, setSneaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showChat, setShowChat] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState("");


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
    useEffect(() => {
        const fetchSneaker = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/sneakers/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Datos recibidos:", data);

                if (data.sneaker && data.sneaker.length > 0) {
                    setSneaker(data.sneaker[0]);
                } else {
                    throw new Error("No se encontraron datos de la zapatilla.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // ✅ Asegurar que el loading cambie
            }
        };

        fetchSneaker();
    }, [id]);

    if (loading) return <p className="text-center">Cargando...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!sneaker) return <p className="text-center">No se encontró la zapatilla.</p>;

    return (
        <div className="detail-container p-4">
            <h1 className="text-2xl font-bold">{sneaker.nombre}</h1>
            <img src={sneaker.imagen} alt={sneaker.nombre} className="rounded-xl shadow-lg w-60" />
            <p className="mt-2 text-gray-600">Descripción: {sneaker.descripcion}</p>
            <p className="mt-2 font-bold text-lg text-green-500">Precio: ${sneaker.precio}</p>
            <Button variant="primary" onClick={() => handleChat(sneaker)}>
                Preguntar al Chatbot
            </Button>
            <Modal className="chatBot" show={showChat} onHide={() => setShowChat(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Preguntar sobre {selectedProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese su pregunta"
                        value={pregunta}
                        onChange={(e) => setPregunta(e.target.value)}
                    />
                    <Button className="mt-2" onClick={enviarPregunta}>
                        Enviar
                    </Button>
                    {respuesta && (
                        <p className="mt-3">
                            <strong>Chatbot:</strong> {respuesta}
                        </p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Sneaker;
