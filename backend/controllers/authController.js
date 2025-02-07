import { getUserByCredentials } from "../Models/userModel.js";
import { generateToken } from "../services/token.js"; // Asegúrate de tener un helper para tokens

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByCredentials(username, password);

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = generateToken({ password: user.clave });
        const authToken = generateToken({ username: user.usuario });

        res.cookie("sneakers", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000),
            sameSite: "none",
            secure: true
        });

        res.json({
            message: "Login successful",
            username: user.usuario,
            token,
            authToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { login } ;
