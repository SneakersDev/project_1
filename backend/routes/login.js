import router from "express";
import pool from "../services/connect.js";
import { generateToken } from "../services/token.js";

const loginRouter = router();

loginRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [result] = await pool.query("SELECT * FROM usuarios WHERE usuario = ? AND clave = ?", [username, password]);
        if (result.length > 0) {
            
            const { username, password: hashedPassword } = result[0];
            if (password !== hashedPassword) {
                res.status(401).json({ message: "Invalid username or password" });
                return;
            } else {
                const token = generateToken({ hashedPassword });
                const authToken = generateToken({ username });
                res.cookie("token", token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 60 * 60 * 1000),
                    sameSite: "none",
                    secure: true 
                });
                res.json({ message: "Login successful", token, authToken });
                return;
            }
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default loginRouter;