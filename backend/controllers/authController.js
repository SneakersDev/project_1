import { createUser, findUserByUid } from "../Models/userModel.js";
import { generateToken } from "../services/token.js";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
    const { username, password, email, uid, providerId, displayName } = req.body;

    try {
        let user = await findUserByUid(uid);

        if (!user) {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash("defaultPassword123", 10);

            user = await createUser({
                uid: uid || "", 
                email,
                username: username || email,
                provider: providerId || "",
                displayName: displayName || "",
                clave: hashedPassword,
            });

            console.log("✅ Usuario creado:", user);
        } else {
            console.log("✅ Usuario encontrado:", user);
        }

        const isPasswordValid = password ? await bcrypt.compare(password, user.clave) : true;
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const authToken = generateToken({ displayName: user.displayName, uid: user.uid });

        res.cookie("Sneakers", authToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000),
            sameSite: "lax",
            secure: false,
        });

        res.json({
            message: "Login successful",
            username: user.usuario,
            authToken
        });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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

export default { login, register };
