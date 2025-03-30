// Importamos mongoose para definir el esquema del sneaker
import mongoose from 'mongoose';

// Definimos el esquema del sneaker
const sneakerSchema = new mongoose.Schema({

  // Nombre del sneaker
  nombre: {
    type: String,
    required: true // Campo obligatorio
  },

  // Descripción del sneaker
  descripcion: {
    type: String,
    required: true // Campo obligatorio
  },

  // Modelo del sneaker
  modelo: {
    type: String,
    required: true // Campo obligatorio
  },

  // Talla del sneaker
  talla: {
    type: String,
    required: true // Campo obligatorio
  },

  // Color del sneaker
  color: {
    type: String,
    required: true // Campo obligatorio
  },

  // Ubicación geográfica del sneaker (GeoJSON tipo "Point")
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'], // Solo se acepta tipo "Point"
      required: true
    },
    coordinates: {
      type: [Number], // Formato: [longitud, latitud]
      required: true
    }
  },

  // ID del archivo almacenado en GridFS (opcional)
  imagenId: {
    type: mongoose.Schema.Types.ObjectId, // ID del archivo en uploads.files
    ref: 'uploads.files', // Referencia a colección de archivos
    required: false // Este campo es opcional
  },

  // Precio del sneaker
  precio: {
    type: Number,
    required: true // Campo obligatorio
  },

  // Arreglo de referencias a las sedes del sneaker (0 a muchas)
  sedes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sede' // Referencia al modelo Sede
  }]
});

// Creamos un índice espacial para mejorar las consultas geográficas
sneakerSchema.index({ ubicacion: '2dsphere' });

// Exportamos el modelo Sneaker para usarlo en controladores y rutas
const Sneaker = mongoose.model('Sneaker', sneakerSchema);
export default Sneaker;
