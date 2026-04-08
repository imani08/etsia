import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import prisma from "./config/prisma.js";
import authRoutes from "./modules/auth/auth.routes.js";



const app = express();

// Middlewares globaux
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("API TaxiSafe OK");
});

// Health check (API + DB)
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "OK",
      database: "connected",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "ERROR",
      database: "disconnected",
    });
  }
});

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Gestion globale des erreurs
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

export default app;