import pool from "../services/connect.js";
export const getUserByCredentials = async (username, password) => {
    try {
        const [result] = await pool.query(
            "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?",
            [username, password]
        );
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        throw error;
    }
};

