import router from "express";
import pool from "../services/connect.js";
import { generateToken } from "../services/token.js";

const loginRouter = router();

loginRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [result] = await pool.query("SELECT * FROM usuarios WHERE usuario = ? AND clave = ?", [username, password]);
        if (result.length > 0) {
            const { username, password: dbpassword } = result[0];
            const token = generateToken({ password: dbpassword });
            const authToken = generateToken({ username });
            res.cookie("sneakers", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 60 * 60 * 1000),
                sameSite: "none",
                secure: true 
            });
            res.json({ message: "Login successful", username, password: dbpassword }, token, authToken);
            return;
        }else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default loginRouter;