import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "./config/prisma.js";
import authRoutes from "./modules/auth/auth.routes.js";
import driverRoutes from "./routes/driverRoutes"; 
import adminRoutes from "./routes/adminRoutes";
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Middlewares globaux
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/auth", authRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("API TaxiSafe OK");
});


app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "OK", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "ERROR", database: "disconnected" });
  }
});

// 404 : Gestion des routes inexistantes (doit être juste avant le middleware d'erreur)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Gestion globale des erreurs : UNIQUE et à la FIN
app.use(errorMiddleware);

export default app;
