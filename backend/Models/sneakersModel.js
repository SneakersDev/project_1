import pool from "../services/connect.js";

export const getSneakers = async () => {
    const [rows] = await pool.query(`CALL getSneakers()`);
    return rows[0]; // CALL devuelve un array con los resultados en la primera posición
};


export const getSneakerByMarca = async (marca_id) => {
    const [rows] = await pool.query(`CALL getSneakerByMarca(?)`, [marca_id]);
    return rows[0]; // Retornamos la primera parte del resultado (las filas)
};

export const getSneakersByCategory = async (category_id) => {
    const [rows] = await pool.query(`CALL getSneakersByCategory(?)`, [category_id]);
    return rows[0]; // Retornamos la primera parte del resultado (las filas)
};

export const getSneakerByMarcaAndCategory = async (marca_id, category_id) => {
    const [rows] = await pool.query(`CALL getSneakersByMarcaAndCategory(?, ?)`, [marca_id, category_id]);
    return rows[0]; // Retornamos la primera parte del resultado (las filas)
};

export const getSneakersByName = async (name) => {
    const [rows] = await pool.query(`CALL getSneakersByName(?)`, [name]);
    return rows[0]; // Retornamos las filas del resultado
};
export const getSneakersById = async (id) => {
    const [rows] = await pool.query(`CALL getSneakersByID(?)`, [id]);
    return rows[0]; // Retornamos la primera parte del resultado (las filas)
};