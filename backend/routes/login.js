import router from "express";
import pool from "../services/connect.js";

const loginRouter = router();

loginRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [result] = await pool.query("SELECT * FROM usuarios WHERE usuario = ? AND clave = ?", [username, password]);
        if (result.length > 0) {
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default loginRouter;