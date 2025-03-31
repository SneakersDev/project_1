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
  // Verificar si ya existe un usuario con el mismo email
  const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

  if (existingUser.length > 0) {
    throw new Error("El usuario ya está registrado.");
  }

  // Inserta el nuevo usuario si no existe
  await pool.query(
    "INSERT INTO users (uid, email, username, provider, displayName, clave) VALUES (?, ?, ?, ?, ?, ?)",
    [uid, email, username, provider, displayName, clave]
  );

  // Recuperar el usuario recién creado
  const [rows] = await pool.query("SELECT * FROM users WHERE uid = ?", [uid]);
  return rows[0];
};

export const getRol = async (id) => {
  // Verificar si id es válido
  if (!id) {
    throw new Error('ID es requerido');
  }

  try {
    const [rows] = await pool.query("SELECT rol FROM users WHERE uid = ?", [id]);

    // Si no se encuentra el rol, devolver null
    if (rows.length === 0) {
      return { rol: null };
    }

    return { rol: rows[0].rol };

  } catch (error) {
    console.error('Error en getRol:', error);
    throw new Error('Error al recuperar el rol');
  }
};


