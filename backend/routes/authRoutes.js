import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../services/passport.js"; // Configuración de estrategias OAuth
import { findUserByEmail, createUser, saveToken } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const loginRouter = express.loginRouter();

// 📌 1️⃣ Login con correo y contraseña
loginRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await saveToken(user.uid, token);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 📌 2️⃣ Registro con correo y contraseña
loginRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = crypto.randomUUID(); // Genera un UID único
    await createUser(uid, email, hashedPassword, "local");

    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 📌 3️⃣ Login con Google (OAuth)
loginRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
loginRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  const token = jwt.sign({ uid: req.user.uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
  saveToken(req.user.uid, token);
  res.redirect(`/dashboard?token=${token}`);
});

// 📌 4️⃣ Login con GitHub (OAuth)
loginRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
loginRouter.get("/github/callback", passport.authenticate("github", { session: false }), (req, res) => {
  const token = jwt.sign({ uid: req.user.uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
  saveToken(req.user.uid, token);
  res.redirect(`/dashboard?token=${token}`);
});

export default loginRouter;
