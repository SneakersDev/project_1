// routes/chatbotRoutes.js
import express from "express";
import { chatbotHandler } from "../controllers/chatbotController.js"; // Asegúrate de agregar `.js` al final

const chatbotRouter = express.Router();

chatbotRouter.post("/chatbot", chatbotHandler);

export default chatbotRouter;
