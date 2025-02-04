import express, { Request, Response, NextFunction } from "express";
import { conDB } from "../src/connect/DBconnect";
import cors from "cors";
import cookieParser from "cookie-parser";
import tasksRoutes from "../src/routes/taskRoutes";
import userRoutes from "../src/routes/userRoutes";
import authRoutes from "../src/routes/authRoutes"
import projectRoutes from '../src/routes/projectRoutes'

const app = express();
const port = process.env.PORT || 3000;

// permitir cokkies
app.use(cookieParser());

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Cambia esto al dominio de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/tasks", tasksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

conDB().then(() =>
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  })
);
