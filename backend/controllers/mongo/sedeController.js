// Importamos modelos
import Sede from '../../Models/mongo/Sede.js';
// Importamos el modelo de Sneaker
import Sneaker from '../../Models/mongo/Sneaker.js';

// Importamos acceso a GridFS
import { gfs } from '../../services/db.js';

// Importamos mongoose para manejar ObjectId
import mongoose from 'mongoose';

// ====================================
// Crear una nueva sede para un sneaker
// ====================================
export const crearSede = async (req, res, next) => {
  try {
    // Extraemos campos del cuerpo
    const { sneakerId, nombre, direccion, ubicacion } = req.body;
    const imagenId = req.file ? req.file.id : null;

    // Verificamos que el sneaker exista
    const sneaker = await Sneaker.findById(sneakerId);
    if (!sneaker) {
      return res.status(404).json({ mensaje: 'Sneaker no encontrado' });
    }

    // Validamos la ubicación
    let ubicacionParseada;
    try {
      ubicacionParseada = JSON.parse(ubicacion);
    } catch (error) {
      return res.status(400).json({ mensaje: 'Ubicación no válida' });
    }

    // Creamos nueva sede
    const nuevaSede = new Sede({
      sneaker: sneaker.id, 
      nombre,
      direccion,
      ubicacion: ubicacionParseada,
      imagenId,
    });

    // Guardamos la sede
    const sedeGuardada = await nuevaSede.save();

    // Asociamos la sede al sneaker
    sneaker.sedes.push(sedeGuardada._id);
    await sneaker.save();

    res.status(201).json(sedeGuardada);
  } catch (error) {
    error.message = "Error al crear la sede";
    return next(error);
  }
};

// =======================
// Obtener sede por su ID
// =======================
export const obtenerSedePorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sede = await Sede.findById(id).populate('sneaker').exec();

    if (!sede) {
      return res.status(404).json({ mensaje: 'Sede no encontrada' });
    }

    res.status(200).json(sede);
  } catch (error) {
    error.message = "Error al obtener la sede";
    return next(error);
  }
};

// ===========================
// Actualizar sede por su ID
// ===========================
export const actualizarSede = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, ubicacion } = req.body;
    const imagenId = req.file ? req.file.id : null;

    let ubicacionParseada;
    try {
      ubicacionParseada = ubicacion ? JSON.parse(ubicacion) : undefined;
    } catch (error) {
      return res.status(400).json({ mensaje: 'Ubicación no válida' });
    }

    const sedeActualizada = await Sede.findByIdAndUpdate(
      id,
      {
        nombre,
        direccion,
        ...(ubicacionParseada && { ubicacion: ubicacionParseada }),
        ...(imagenId && { imagenId })
      },
      { new: true }
    );

    if (!sedeActualizada) {
      return res.status(404).json({ mensaje: 'Sede no encontrada' });
    }

    res.status(200).json(sedeActualizada);
  } catch (error) {
    error.message = "Error al actualizar la sede";
    return next(error);
  }
};

// ==========================
// Eliminar sede por su ID
// ==========================
export const eliminarSede = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sede = await Sede.findByIdAndDelete(id);

    if (!sede) {
      return res.status(404).json({ mensaje: 'Sede no encontrada' });
    }

    // Remover referencia en el sneaker
    await Sneaker.findByIdAndUpdate(sede.sneaker, {
      $pull: { sedes: sede._id }
    });

    // Eliminar imagen asociada en GridFS si existe
    if (sede.imagenId) {
      await gfs.files.deleteOne({ _id: new mongoose.Types.ObjectId(sede.imagenId) });
    }

    res.status(200).json({ mensaje: 'Sede eliminada correctamente' });
  } catch (error) {
    error.message = "Error al eliminar la sede";
    return next(error);
  }
};

// ==================================
// Obtener imagen asociada a la sede
// ==================================
export const obtenerImagenSede = async (req, res, next) => {
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
    error.message = "Error al obtener la imagen de la sede";
    return next(error);
  }
};
