import mongoose from 'mongoose';

// Definición del esquema para Imagen
const ImagenSchema = new mongoose.Schema({
  filename: String, // Nombre del archivo
  contentType: String, // Tipo de contenido (MIME type)
  length: Number, // Tamaño del archivo en bytes
  uploadDate: Date, // Fecha de subida
});

// Exportación del modelo Imagen basado en el esquema definido, asociado a la colección 'fs.files'
const Imagen = mongoose.model('Imagen', ImagenSchema, 'fs.files');
export default Imagen;
