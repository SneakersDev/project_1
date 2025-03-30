import express from 'express';
import upload from '../../middleware/upload.js';
import {
  crearSneaker,
  obtenerSneakers,
  obtenerSneakerPorId,
  obtenerImagenSneaker,
  actualizarSneaker,
  eliminarSneaker
} from '../../controllers/mongo/sneakerController.js';

const router = express.Router();

// Crear sneaker
router.post('/mapas/sneakers/', upload.single('imagen'), crearSneaker);

// Obtener todos
router.get('/mapas/sneakers/', obtenerSneakers);

// Obtener uno
router.get('/mapas/sneakers/:id', obtenerSneakerPorId);

// Obtener imagen
router.get('/mapas/sneakers/imagen/:id', obtenerImagenSneaker);

// Actualizar
router.put('/mapas/sneakers/:id', upload.single('imagen'), actualizarSneaker);

// Eliminar
router.delete('/mapas/sneakers/:id', eliminarSneaker);

export default router;
