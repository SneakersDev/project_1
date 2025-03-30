import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';

// Cargamos variables de entorno desde .env
dotenv.config();

// Configuramos el almacenamiento GridFS con multer-gridfs-storage
const storage = new GridFsStorage({
  // Usamos la URI de MongoDB definida en .env
  url: process.env.MONGO_URI,

  // Configuramos cómo se guardarán los archivos
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generamos un nombre aleatorio para el archivo
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        // Combinamos el hash con la extensión original del archivo
        const filename = buf.toString('hex') + path.extname(file.originalname);

        // Definimos los metadatos del archivo
        resolve({
          filename: filename,
          bucketName: 'uploads', // colección donde GridFS guardará los archivos
        });
      });
    });
  },
});

// Creamos el middleware de subida usando multer con nuestro almacenamiento configurado
const upload = multer({ storage });

// Exportamos el middleware para usarlo en las rutas
export default upload;
