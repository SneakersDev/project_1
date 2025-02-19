import pool from "../services/connect.js";

export const getSneakers = async () => {
    const [rows] = await pool.query("SELECT * FROM sneakers");
    return rows;
};

export const getSneakerByMarca = async (marca_id) => {
    const [rows] = await pool.query("SELECT * FROM sneakers WHERE marca_id = ?", [marca_id]);
    return rows[0];
};

export const getSneakersByCategory = async (category) => {
    const [rows] = await pool.query("SELECT * FROM sneakers WHERE categoria_id = ?", [category]);
    return rows;
};