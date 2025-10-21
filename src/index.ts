import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

// Configura dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON (recomendado si tendrás POST/PUT)
app.use(express.json());

// Configura morgan como logger
// "dev" = formato colorido y compacto ideal para desarrollo
app.use(morgan("dev"));

// Ejemplo de ruta
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

// Inicia el servidor
app
  .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
