import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Tipo personalizado SIN depender de JwtPayload
export interface JwtUserPayload {
  id: number | string;
  email: string;
  name: string;
  lastname: string;
  iat?: number;
  exp?: number;
}

// === Función para hashear contraseña ===
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// === Función para verificar contraseña ===
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// === Función para generar token JWT ===

export const generateToken = (user: JwtUserPayload): string => {
  const JWT_SECRET = process.env.JWT_SECRET ?? "mi_clave_secreta_para_jwt";

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

// === Función para verificar token JWT ===
export const verifyToken = (token: string): JwtUserPayload => {
  const JWT_SECRET = process.env.JWT_SECRET ?? "mi_clave_secreta_para_jwt";

  // jwt.verify devuelve `string | object`
  const decoded = jwt.verify(token, JWT_SECRET);

  // Forzamos el tipo sin usar JwtPayload
  return decoded as JwtUserPayload;
};
