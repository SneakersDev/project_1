// controllers/chatbotController.js
import axios from "axios";

const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL;

export const chatbotHandler = async (req, res) => {
    const { pregunta, product_id } = req.body;

    if (!pregunta || !product_id) {
        return res.status(400).json({ error: "Faltan parámetros en la solicitud." });
    }

    try {
        const response = await axios.post(`${CHATBOT_SERVICE_URL}/chat`, req.body);

        if (!response.data || Object.keys(response.data).length === 0) {
            return res.status(500).json({ error: "No se obtuvo respuesta válida del chatbot." });
        }

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("❌ Error al comunicarse con el chatbot:", error.message);
        res.status(500).json({ error: "No se pudo conectar con el chatbot." });
    }
};
