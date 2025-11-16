import rateLimit from "express-rate-limit";

// Limiter general para todas las rutas

export const generalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error:
      "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter para rutas de autenticación (login)

export const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_LOGIN_MAX) || 5, // Solo 5 intentos
  message: {
    error:
      "Demasiados intentos de login, por favor intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter para creación de usuarios

export const createUserLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: Number(process.env.RATE_LIMIT_REGISTER_MAX) || 10,
  message: {
    error:
      "Demasiadas creaciones de usuario desde esta IP, por favor intenta de nuevo más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
