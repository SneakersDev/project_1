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
export const createUser = async (uid, email, password = null, provider = "local") => {
  await pool.query(
    "INSERT INTO users (uid, email, password, provider) VALUES (?, ?, ?, ?)",
    [uid, email, password, provider]
  );
};

// 🔑 Guardar token (después de iniciar sesión)
export const saveToken = async (uid, token) => {
  await pool.query("UPDATE users SET token = ? WHERE uid = ?", [token, uid]);
};
