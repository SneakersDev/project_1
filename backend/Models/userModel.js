import pool from "../services/connect.js";

// 🔍 Buscar usuario por UID
export const findUserByUid = async (uid) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE uid = ?", [uid]);
  return rows[0];
};

// 🔍 Buscar usuario por email (para login con email/contraseña)
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// 🆕 Crear usuario (para Google, GitHub o correo/contraseña)
export const createUser = async ({ uid, email, username, provider, displayName, clave }) => {
  await pool.query(
    "INSERT INTO users (uid, email, username, provider, displayName, clave) VALUES (?, ?, ?, ?, ?, ?)",
    [uid, email, username, provider, displayName, clave]
  );

  // Recuperar el usuario recién creado
  const [rows] = await pool.query("SELECT * FROM users WHERE uid = ?", [uid]);
  return rows[0];
};
