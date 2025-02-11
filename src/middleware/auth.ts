import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Define el tipo personalizado para la solicitud
interface RequestWithUser extends Request {
  user?: { id: string; role: string };
}

// Extiende la interfaz Request de Express para incluir la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string, role: string };
    }
  }
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return 
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    }; // Decodifica el token
    req.user = decoded; // Agrega los datos del usuario al objeto `req`
    next(); // Pasa al siguiente middleware o controlador
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

export const authRoles = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Access denied" });
      return 
    }
    next();
  };
};
