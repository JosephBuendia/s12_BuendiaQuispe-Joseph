// Derivación Serenazgo -> Hospital. La lógica vive en Neon (función serenazgo.derivar_alerta):
// valida el rol, crea la cita de emergencia con id_alerta y marca la alerta como "derivado", todo en una transacción.
import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { normalizarCodigo, codigoValido } from '../utils/codigos.js';

export async function derivarAlerta(usuario, codigoRuta) {
  const codigo = normalizarCodigo(codigoRuta);
  if (!codigoValido(codigo)) throw new AppError(400, 'El código de la alerta no tiene un formato válido.');
  try {
    const { rows } = await pool.query('SELECT * FROM serenazgo.derivar_alerta($1, $2)', [codigo, usuario.id]);
    const r = rows[0];
    return { codigo_alerta: r.o_codigo_alerta, id_cita: r.o_id_cita, codigo_cita: r.o_codigo_cita, nueva: r.o_nueva };
  } catch (error) {
    // Errores definidos por la función SQL -> códigos HTTP claros
    if (error.code === '42501') throw new AppError(403, 'Tu rol no puede derivar alertas.');
    if (error.code === 'P0002') throw new AppError(404, 'La alerta no existe.');
    if (error.code === '22023') throw new AppError(409, error.message);
    throw error;
  }
}

// El vecino ve sus alertas junto con la cita que generaron (HU-2.4).
export async function misAlertas(usuario) {
  const { rows } = await pool.query(
    `SELECT codigo_alerta, ubicacion, estado_alerta, hay_heridos, fecha_registro, codigo_cita, estado_cita, especialidad
       FROM serenazgo.alertas_con_cita WHERE id_usuario = $1
      ORDER BY fecha_registro DESC, id DESC LIMIT 200`,
    [usuario.id]
  );
  return rows;
}
