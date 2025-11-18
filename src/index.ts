import express from "express";
import adminRouter from "./admin/admin.router.js";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import clientRoute from "./services/client/client.route.js";
import fieldRoute from "./services/field/field.route.js";
import lotRoute from "./services/lot/lot.route.js";
import machineryRoute from "./services/machinery/machinery.route.js";
import workOrderRouter from "./services/workOrder/workOrder.route.js";
import lotDetailRouter from "./services/workOrder/details/lotDetail/lotDetail.route.js";
import machineryDetailRouter from "./services/workOrder/details/machineryDetail/machineryDetail.route.js";
import userRouter from "./services/user/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// Configura dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON (recomendado si tendrás POST/PUT)
app.use(express.json());
// cookie-parser para leer cookies (req.cookies)
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Configura morgan como logger
// "dev" = formato colorido y compacto ideal para desarrollo
app.use(morgan("dev"));

app.use("/admin", adminRouter);

// Ejemplo de ruta
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

app.use("/api/client", clientRoute);
app.use("/api/field", fieldRoute);
app.use("/api/lot", lotRoute);
app.use("/api/machinery", machineryRoute);
app.use("/api/workOrders", workOrderRouter);
app.use("/api/workOrders/:id/lotDetails", lotDetailRouter);
app.use("/api/workOrders/:id/machineryDetails", machineryDetailRouter);
app.use("/api/users", userRouter);
// Inicia el servidor
app
  .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
