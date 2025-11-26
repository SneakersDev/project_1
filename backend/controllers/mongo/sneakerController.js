import mongoose from 'mongoose';
import Sneaker from '../../Models/mongo/Sneaker.js';
import { gfs } from '../../services/db.js';

// ===========================
// Crear un nuevo sneaker
// ===========================
export const crearSneaker = async (req, res, next) => {
  try {
    const { nombre, descripcion, modelo, talla, color, precio, ubicacion } = req.body;

    const nuevoSneaker = {
      nombre,
      descripcion,
      modelo,
      talla,
      color,
      precio,
      ubicacion: JSON.parse(ubicacion),
    };

    if (req.file?.id) {
      nuevoSneaker.imagenId = req.file.id;
    }

    const sneakerCreado = await Sneaker.create(nuevoSneaker);
    res.status(201).json(sneakerCreado);
  } catch (error) {
    error.message = "Error al crear sneaker";
    return next(error);
  }
};

// ===========================
// Obtener todos los sneakers
// ===========================
export const obtenerSneakers = async (req, res, next) => {
  try {
    const sneakers = await Sneaker.find().populate('sedes').exec();
    res.status(200).json(sneakers);
  } catch (error) {
    error.message = "Error al obtener los sneakers";
    return next(error);
  }
};

// ===========================
// Obtener sneaker por ID
// ===========================
export const obtenerSneakerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sneaker = await Sneaker.findById(id).populate('sedes').exec();

    if (!sneaker) {
      return res.status(404).json({ mensaje: 'Sneaker no encontrado' });
    }

    res.status(200).json(sneaker);
  } catch (error) {
    error.message = "Error al obtener el sneaker";
    return next(error);
  }
};

// ===========================
// Actualizar sneaker por ID
// ===========================
export const actualizarSneaker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, modelo, talla, color, precio, ubicacion } = req.body;
    const imagenId = req.file?.id || null;

    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se envió ninguna imagen' });
    }

    const sneakerActualizado = await Sneaker.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        modelo,
        talla,
        color,
        precio,
        ubicacion: JSON.parse(ubicacion),
        ...(imagenId && { imagenId }),
      },
      { new: true }
    );

    if (!sneakerActualizado) {
      return res.status(404).json({ mensaje: 'Sneaker no encontrado' });
    }

    res.status(200).json(sneakerActualizado);
  } catch (error) {
    error.message = "Error al actualizar el sneaker";
    return next(error);
  }
};

// ===========================
// Eliminar sneaker por ID
// ===========================
export const eliminarSneaker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sneakerEliminado = await Sneaker.findByIdAndDelete(id);

    if (!sneakerEliminado) {
      return res.status(404).json({ mensaje: 'Sneaker no encontrado' });
    }

    res.status(200).json({ mensaje: 'Sneaker eliminado correctamente' });
  } catch (error) {
    error.message = "Error al eliminar el sneaker";
    return next(error);
  }
};

// ===========================
// Obtener imagen desde GridFS
// ===========================
export const obtenerImagenSneaker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const file = await gfs.files.findOne({ _id: objectId });

    if (!file) {
      return res.status(404).json({ mensaje: 'Imagen no encontrada' });
    }

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    error.message = "Error al obtener la imagen";
    return next(error);
  }
};
