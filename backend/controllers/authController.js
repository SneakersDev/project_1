import { findUserByUid } from "../Models/userModel.js";
import { generateToken } from "../services/token.js";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar usuario en la base de datos
        const user = await findUserByUid(username);
        
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.clave);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generar tokens
        const authToken = generateToken({ username: user.usuario });

        // Configurar la cookie segura
        res.cookie("authToken", authToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000), // Expira en 1 hora
            sameSite: "none",
            secure: true
        });

        // Responder con éxito
        res.json({
            message: "Login successful",
            username: user.usuario,
            authToken
        });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { login };
