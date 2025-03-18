import jwt from "jsonwebtoken";
import { getSneakerByMarca, getSneakers, getSneakersByCategory, getSneakerByMarcaAndCategory } from "../Models/sneakersModel.js";

const allSneakers = async (req, res) => {
    const token = req.cookies?.sneakers;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Verificamos el token. No enviamos respuesta aquí.
        jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    try {
        // Una vez validado el token, obtenemos los sneakers.
        const sneakers = await getSneakers();
        return res.json({ sneakers });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving sneakers", error });
    }
};


const sneakersByCategory = async (req, res) => {
    const token = req.cookies?.sneakers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Verificamos el token
        jwt.verify(token, process.env.SECRET_KEY);
        // Si es necesario, puedes utilizar 'data' para algo más.
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    
    // Extraemos el parámetro 'marca' de la query
    const category = req.query.category;
    try {
        // Obtenemos los sneakers correspondientes a la marca
        const sneakers = await getSneakersByCategory(category);
        return res.json({ sneakers });
    } catch (error) {
        // Manejamos cualquier error que pueda ocurrir al obtener los sneakers
        return res.status(500).json({ message: "Error retrieving sneakers", error });
    }
};

const sneakersByMarca = async (req, res) => {
    const token = req.cookies?.sneakers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Verificamos el token
        jwt.verify(token, process.env.SECRET_KEY);
        // Si es necesario, puedes utilizar 'data' para algo más.
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    
    // Extraemos el parámetro 'marca' de la query
    const marca = req.query.marca;
    try {
        // Obtenemos los sneakers correspondientes a la marca
        const sneakers = await getSneakerByMarca(marca);
        return res.json({ sneakers });
    } catch (error) {
        // Manejamos cualquier error que pueda ocurrir al obtener los sneakers
        return res.status(500).json({ message: "Error retrieving sneakers", error });
    }
};

const sneakersByCategoryAndMarca = async (req, res) => {
    const token = req.cookies?.sneakers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Verificamos el token
        jwt.verify(token, process.env.SECRET_KEY);
        // Si es necesario, puedes utilizar 'data' para algo más.
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    
    // Extraemos el parámetro 'marca' de la query
    const marca = req.query.marca;
    const category = req.query.category;
    try {
        // Obtenemos los sneakers correspondientes a la marca
        const sneakers = await getSneakerByMarcaAndCategory(marca, category);
        return res.json({ sneakers });
    } catch (error) {
        // Manejamos cualquier error que pueda ocurrir al obtener los sneakers
        return res.status(500).json({ message: "Error retrieving sneakers", error });
    }
};

export default { allSneakers, sneakersByCategory, sneakersByMarca, sneakersByCategoryAndMarca };
