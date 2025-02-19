import pool from "../services/connect.js";

export const getSneakers = async () => {
    const [rows] = await pool.query(`
        SELECT s.id, s.nombre, s.descripcion, s.modelo, 
            m.nombre AS marca, c.nombre AS categoria
        FROM sneakers s
        JOIN marcas m ON s.marca_id = m.id
        JOIN categorias c ON s.categoria_id = c.id
    `);
    return rows;
};


export const getSneakerByMarca = async (marca_id) => {
    const [rows] = await pool.query(`
        SELECT s.id, s.nombre, s.descripcion, s.modelo, 
            m.nombre AS marca, c.nombre AS categoria
        FROM sneakers s
        JOIN marcas m ON s.marca_id = m.id
        JOIN categorias c ON s.categoria_id = c.id
        WHERE s.marca_id = ?
    `, [marca_id]);
    return rows;
};

export const getSneakersByCategory = async (category_id) => {
    const [rows] = await pool.query(`
        SELECT s.id, s.nombre, s.descripcion, s.modelo, 
            m.nombre AS marca, c.nombre AS categoria
        FROM sneakers s
        JOIN marcas m ON s.marca_id = m.id
        JOIN categorias c ON s.categoria_id = c.id
        WHERE s.categoria_id = ?
    `, [category_id]);
    return rows;
};

export const getSneakerByMarcaAndCategory = async (marca_id, category_id) => {
    const [rows] = await pool.query(`
        SELECT s.id, s.nombre, s.descripcion, s.modelo, 
            m.nombre AS marca, c.nombre AS categoria
        FROM sneakers s
        JOIN marcas m ON s.marca_id = m.id
        JOIN categorias c ON s.categoria_id = c.id
        WHERE s.marca_id = ? AND s.categoria_id = ?
    `, [marca_id, category_id]);
    return rows;
};