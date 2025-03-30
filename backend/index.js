import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import mongoose from 'mongoose';

import sneakersRouter from "./routes/sneakersRoutes.js";
import loginRouter from "./routes/authRoutes.js";
import chatbotRouter from "./routes/chatbotRoutes.js";
import sneakerRoutes from './routes/mongo/sneakerRoutes.js';
import sedeRoutes from './routes/mongo/sedeRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// Conexión a la base de datos MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, // Usa el nuevo analizador de URL de MongoDB
  useUnifiedTopology: true, // Usa el nuevo motor de gestión de conexiones
})
  .then(() => console.log('Conectado a MongoDB Atlas')) // Mensaje en consola si la conexión es exitosa
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err)); // Manejo de errores en la conexión


app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.use("/api", loginRouter);
app.use("/api", sneakersRouter);
app.use("/api", chatbotRouter);
app.use('/api', sneakerRoutes);
app.use('/api', sedeRoutes);

app.listen(port, () => {
    console.log(`Server running on route http://localhost:${port}`);
});
