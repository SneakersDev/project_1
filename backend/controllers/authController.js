import { createUser, findUserByUid, findUserByEmail, getRol } from "../Models/userModel.js";
import { generateToken } from "../services/token.js";
import pool from "../services/connect.js"; // Asegúrate de que pool esté correctamente importado
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Asegúrate de tener esto para generar UID

// Login para proveedores externos (o flujo híbrido)
const login = async (req, res) => {
    const { username, password, email, uid, providerId, displayName } = req.body;

    try {
        let user;
        
        // Si se envía uid, buscamos por uid
        if (uid) {
            user = await findUserByUid(uid);
        }
        
        // Si no se encontró el usuario, se crea uno (flujo para proveedores)
        if (!user) {
            const hashedPassword = password 
                ? await bcrypt.hash(password, 10) 
                : await bcrypt.hash("defaultPassword123", 10);
            const newUid = uid || crypto.randomUUID();

            user = await createUser({
                uid: newUid,
                email,
                username: username || email,
                provider: providerId || "local",
                displayName: displayName || "",
                clave: hashedPassword,
            });

            console.log("✅ Usuario creado:", user);
        } else {
            console.log("✅ Usuario encontrado:", user);
        }

        // Si se proporcionó contraseña, se verifica (esto puede aplicarse para proveedores con password)
        if (password) {
            const isPasswordValid = await bcrypt.compare(password, user.clave);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid username or password" });
            }
        }

        const authToken = generateToken({ email: user.email, username: user.username });

        res.cookie("sneakers", authToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000),
            sameSite: "None",
            secure: true,
        });

        res.json({
            message: "Login successful",
            username: user.username,
            authToken
        });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login exclusivo para email y contraseña (no crea el usuario si no existe)
const loginWithEmail = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.clave);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const authToken = generateToken({ email: user.email });

        res.cookie("sneakers", authToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000),
            sameSite: "None",
            secure: true,
        });

        res.json({
            message: "Login successful",
            username: user.username,
            authToken
        });

    } catch (error) {
        console.error("❌ Error en loginWithEmail:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Registro de usuario con email y contraseña
const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const uid = crypto.randomUUID();

        await createUser({
            uid,
            email,
            username: email,
            provider: "local",
            displayName: email,
            clave: hashedPassword,
        });

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("❌ Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const getRole = async (req, res) => {
  try {
    const { id } = req.params;  // Aquí obtenemos el id de los parámetros de la URL

    // Verificar que el id no sea nulo o vacío
    if (!id) {
      return res.status(400).json({ message: "El ID es requerido" });
    }

    // Llamar al modelo para obtener el rol
    const result = await getRol(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    if (result.rol === null) {
      return res.status(404).json({ message: 'Rol no encontrado', rol: null });
    }

    // Si todo va bien, devuelve el rol
    return res.status(200).json({ message: 'Rol obtenido exitosamente', rol: result.rol });
    
  } catch (error) {
    console.error('❌ Error en getRole:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};



export default { login, loginWithEmail, register, getRole };
