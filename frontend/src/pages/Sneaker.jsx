import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Nav from "../components/Nav";
import "../styles/sneaker/sneaker.css";
import Footer from "../components/Footer";
import { IoMdSettings } from "react-icons/io";
import { RiHomeLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguajeSelector";
import AccessibilityButtons from "../components/Accesibility";
import { getApiUrl } from "../assets/getapi";


function Sneaker() {

    const { t } = useTranslation();

    const { id } = useParams();
    const [sneaker, setSneaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showChat, setShowChat] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState("");


    const navigate = useNavigate();
    
    const handleChat = (producto) => {
            setSelectedProduct(producto);
            setShowChat(true);
        };
    
    const enviarPregunta = async () => {
        if (!pregunta) return;
        try {
            const response = await axios.post(
              getApiUrl("/chatbot"),
              {
                  pregunta,
                  product_id: selectedProduct.id,
              }
            );
            setRespuesta(response.data.respuesta || "No se obtuvo respuesta");
        } catch (error) {
            setRespuesta("Error al comunicarse con el chatbot");
        }
    };
    useEffect(() => {
        const fetchSneaker = async () => {
            try {
                const response = await fetch(
                  getApiUrl(`/sneakers/${id}`),
                  {
                      method: "GET",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      credentials: "include",
                  }
                );

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

    if (loading) return <p className="text-center">{t("sneaker.loading")}</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!sneaker) return <p className="text-center">{t("sneaker.noSneaker")}</p>;

    return (
        <div className="containerDetails p-4 mt-2">
            <div className="home-buttons">
                <Nav showButtons={true}/>
            </div>
            <div className="languajeSneaker">
                <LanguageSelector />
            </div>
            <div className="accesibilitySneaker">
                <AccessibilityButtons />
            </div>
            <div className="container">
                <div className="title">
                    <h1>SNEAKERS</h1>
                </div>
                <div className="containerInfo">
                    <div className="infoImage">
                        <img src={sneaker.imagen} alt={sneaker.nombre} />
                    </div>
                    <div className="infoDates">
                        <h2 className="text-2xl font-bold mb-4">{sneaker.nombre}</h2>
                        <p className="mt-2 text-gray-600">{sneaker.descripcion}</p>
                        <div className="infoButton">
                            <p className="mt-2 font-bold text-lg text-green-500">${sneaker.precio}</p>
                            <Button variant="primary" onClick={() => handleChat(sneaker)}>
                                {t("sneaker.chatbot")}
                            </Button>
                        </div>
                    </div>

                    <Modal className="chatBot" show={showChat} onHide={() => setShowChat(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("sneaker.chatbotTitle", { name: selectedProduct?.name })}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="box">
                            <h5 className="mb-3">{t("sneaker.chatbotSubtitle")}</h5>
                            <Form.Control
                                type="text"
                                placeholder={t("sneaker.chatbotPlaceholder")}
                                value={pregunta}
                                onChange={(e) => setPregunta(e.target.value)}
                            />
                            <Button className="mt-2" onClick={enviarPregunta}>
                                {t("sneaker.send")}
                            </Button>
                            {respuesta && (
                                <p className="mt-3">
                                    <strong>{t("sneaker.chatbotLabel")}:</strong> {respuesta}
                                </p>
                            )}
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
                <Footer />
            </div>
            {/* Mobile Nav (Visible solo en ciertas resoluciones) */}
            <div className="mobile-nav userMobile sneakerMobile">
            <button
                className="btn btn-primary mobile-modal"
                data-bs-toggle="modal"
                data-bs-target="#mobileOptionsModal"
                aria-label={t("sneaker.moreOptions")}
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
                    {t("sneaker.tools")}
                    </h5>
                    <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label={t("sneaker.close")}
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="buttonsMobile">
                    <p className="textMobile">
                        {t("sneaker.navigateSections")}
                    </p>
                    <button
                        onClick={() => window.location.assign("/dashboard")}
                        className="btn btn-primary btnMobiles"
                        aria-label={t("sneaker.home")}
                    >
                        {t("sneaker.home")} <RiHomeLine />
                    </button>
                    <hr/>
                    <button
                        onClick={() => window.location.assign("/favorites")}
                        className="btn btn-primary btnMobiles"
                        aria-label={t("sneaker.favorites")}
                    >
                        {t("sneaker.favorites")} <FaRegHeart />
                    </button>
                    <hr />
                    <button
                        onClick={() => window.location.assign("/Map")}
                        className="btn btn-primary btnMobiles"
                        aria-label={t("sneaker.location")}
                    >
                        {t("sneaker.location")} <SiGooglemaps />
                    </button>
                    </div>
                    <hr/>
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
}

export default Sneaker;
