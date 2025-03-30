import mongoose from 'mongoose';

// Definición del esquema para Sede
const SedeSchema = new mongoose.Schema({
  sneaker: { type: mongoose.Schema.Types.ObjectId, ref: 'Sneaker', required: true }, // Referencia al sneaker propietario de la sede
  nombre: { type: String, required: true }, // Nombre de la sede
  direccion: { type: String, required: true }, // Dirección de la sede
  ubicacion: {
    type: { type: String, enum: ['Point'], required: true }, // Tipo de geometría (punto)
    coordinates: { type: [Number], required: true }, // Coordenadas [longitud, latitud]
  },
  imagenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Imagen' }, // Referencia a la imagen almacenada en GridFS
});

// Creación de un índice geoespacial en el campo 'ubicacion' para consultas eficientes
SedeSchema.index({ ubicacion: '2dsphere' });

// Exportación del modelo Sede basado en el esquema definido
const Sede = mongoose.model('Sede', SedeSchema);
export default Sede;
