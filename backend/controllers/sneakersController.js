import jwt from "jsonwebtoken";
import { getSneakerByMarca, getSneakers, getSneakersByCategory, getSneakerByMarcaAndCategory, getSneakersByName, getSneakersById } from "../Models/sneakersModel.js";

const allSneakers = async (req, res, next) => {
    const token = req.cookies?.sneakers;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Verificamos el token. No enviamos respuesta aquí.
        jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        error.status = 401;
        error.message = "Invalid token";
        return next(error);
    }

    try {
        // Una vez validado el token, obtenemos los sneakers.
        const sneakers = await getSneakers();
        return res.json({ sneakers });
    } catch (error) {
        const context = "Error retrieving sneakers";
        error.message = error.message
          ? `${context}: ${error.message}`
          : context;
        return next(error);
    }
};


const sneakersByCategory = async (req, res, next) => {
    const token = req.cookies?.sneakers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Verificamos el token
        jwt.verify(token, process.env.SECRET_KEY);
        // Si es necesario, puedes utilizar 'data' para algo más.
    } catch (error) {
        error.status = 401;
        error.message = "Invalid token";
        return next(error);
    }
    
    // Extraemos el parámetro 'marca' de la query
    const category = req.query.category;
    try {
        // Obtenemos los sneakers correspondientes a la marca
        const sneakers = await getSneakersByCategory(category);
        return res.json({ sneakers });
    } catch (error) {
        const context = "Error retrieving sneakers by category";
        error.message = error.message
          ? `${context}: ${error.message}`
          : context;
        return next(error);
    }
};

const sneakersByMarca = async (req, res, next) => {
    const token = req.cookies?.sneakers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Verificamos el token
        jwt.verify(token, process.env.SECRET_KEY);
        // Si es necesario, puedes utilizar 'data' para algo más.
    } catch (error) {
        error.status = 401;
        error.message = "Invalid token";
        return next(error);
    }
    
    // Extraemos el parámetro 'marca' de la query
    const marca = req.query.marca;
    try {
        // Obtenemos los sneakers correspondientes a la marca
        const sneakers = await getSneakerByMarca(marca);
        return res.json({ sneakers });
    } catch (error) {
        const context = "Error retrieving sneakers by marca";
        error.message = error.message
          ? `${context}: ${error.message}`
          : context;
        return next(error);
    }
};

const sneakersByCategoryAndMarca = async (req, res, next) => {
    const token = req.cookies?.sneakers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // Verificamos el token
        jwt.verify(token, process.env.SECRET_KEY);
        // Si es necesario, puedes utilizar 'data' para algo más.
    } catch (error) {
        error.status = 401;
        error.message = "Invalid token";
        return next(error);
    }
    
    // Extraemos el parámetro 'marca' de la query
    const marca = req.query.marca;
    const category = req.query.category;
    try {
        // Obtenemos los sneakers correspondientes a la marca
        const sneakers = await getSneakerByMarcaAndCategory(marca, category);
        return res.json({ sneakers });
    } catch (error) {
        const context = "Error retrieving sneakers by category and marca";
        error.message = error.message
          ? `${context}: ${error.message}`
          : context;
        return next(error);
    }
};

const sneakersByName = async (req, res, next) => {
    const token = req.cookies?.sneakers;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      error.status = 401;
      error.message = "Invalid token";
      return next(error);
    }
    
    // Obtener el término de búsqueda
    const name = req.query.name;
    try {
      const sneakers = await getSneakersByName(name);
      return res.json({ sneakers });
    } catch (error) {
      const context = "Error retrieving sneakers by name";
      error.message = error.message
        ? `${context}: ${error.message}`
        : context;
      return next(error);
    }
};

const sneakerById = async (req, res, next) => {
    const token = req.cookies?.sneakers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        error.status = 401;
        error.message = "Invalid token";
        return next(error);
    }
    const id = req.params.id;
    try {
        const sneaker = await getSneakersById(id);
        return res.json({ sneaker });
    } catch (error) {
        const context = "Error retrieving sneaker by id";
        error.message = error.message
          ? `${context}: ${error.message}`
          : context;
        return next(error);
    }
};

export default { allSneakers, sneakersByCategory, sneakersByMarca, sneakersByCategoryAndMarca, sneakersByName, sneakerById };
