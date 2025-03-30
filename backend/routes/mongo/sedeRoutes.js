import express from 'express';
import upload from '../../middleware/upload.js';
import {
  crearSede,
  obtenerSedePorId,
  obtenerImagenSede,
  actualizarSede,
  eliminarSede
} from '../../controllers/mongo/sedeController.js';

const router = express.Router();

// Crear sede
router.post('/mapas/sedes/', upload.single('imagen'), crearSede);

// Obtener sede por ID
router.get('/mapas/sedes/:id', obtenerSedePorId);

// Obtener imagen de sede
router.get('/mapas/sedes/imagen/:id', obtenerImagenSede);

// Actualizar sede
router.put('/mapas/sedes/:id', upload.single('imagen'), actualizarSede);

// Eliminar sede
router.delete('/mapas/sedes/:id', eliminarSede);

export default router;
