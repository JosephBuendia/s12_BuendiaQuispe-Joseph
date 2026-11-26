import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/derivacion.service.js';

export const derivar = asyncHandler(async (req, res) => {
  const r = await service.derivarAlerta(req.usuario, req.params.codigo);
  res.status(r.nueva ? 201 : 200).json({
    mensaje: r.nueva ? 'Alerta derivada al hospital. Cita de emergencia creada.' : 'La alerta ya estaba derivada.',
    ...r,
  });
});

export const mias = asyncHandler(async (req, res) => {
  res.json(await service.misAlertas(req.usuario));
});
