import { pool } from '../config/db.js';

const COLUMNAS = 'id, codigo_seguimiento, id_usuario, nombre_vecino, ubicacion, descripcion, estado, hay_heridos, fecha_registro';

export async function crear({ codigo, idUsuario, nombreVecino, ubicacion, descripcion }) {
  const { rows } = await pool.query(
    `INSERT INTO alertas_auxilio (codigo_seguimiento, id_usuario, nombre_vecino, ubicacion, descripcion)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNAS}`,
    [codigo, idUsuario, nombreVecino, ubicacion, descripcion]
  );
  return rows[0];
}

export async function listar(estado) {
  const valores = [];
  let where = '';
  if (estado) { valores.push(estado); where = 'WHERE estado = $1'; }
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM alertas_auxilio ${where} ORDER BY fecha_registro DESC, id DESC LIMIT 500`,
    valores
  );
  return rows;
}

export async function actualizarEstado(codigo, estado) {
  const { rows } = await pool.query(
    `UPDATE alertas_auxilio SET estado = $2 WHERE codigo_seguimiento = $1 RETURNING ${COLUMNAS}`,
    [codigo, estado]
  );
  return rows[0] ?? null;
}

export async function buscarSeguimiento(codigo) {
  const { rows } = await pool.query(
    `SELECT codigo_seguimiento AS codigo, ubicacion, estado, fecha_registro
       FROM alertas_auxilio WHERE codigo_seguimiento = $1`,
    [codigo]
  );
  return rows[0] ?? null;
}
