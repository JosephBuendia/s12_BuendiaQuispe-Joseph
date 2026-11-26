import { Router } from 'express';
import * as ctrl from '../controllers/alertas.controller.js';
import * as derivacion from '../controllers/derivacion.controller.js';
import { autenticar, autenticarOpcional } from '../middlewares/auth.js';
import { requireRol } from '../middlewares/requireRol.js';

const router = Router();
const gestion = requireRol('administrador', 'empleado');

router.post('/', autenticarOpcional, ctrl.crear); // el botón de auxilio funciona sin sesión
router.get('/', autenticar, gestion, ctrl.listar);
router.get('/mias', autenticar, derivacion.mias); // el vecino: sus alertas + la cita que generaron
router.patch('/:codigo/estado', autenticar, gestion, ctrl.cambiarEstado);
router.post('/:codigo/derivar', autenticar, gestion, derivacion.derivar); // crea la cita de emergencia en el Hospital

export default router;
