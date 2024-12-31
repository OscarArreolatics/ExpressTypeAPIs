import { Request, Response } from "express";
import { LoginSchemaVali } from "../models/user";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

class authController {

  login = async (req: Request, res: Response) => {
    const { error } = LoginSchemaVali.validate(req.body);
    
    if (error) {
      res.send({code: "INVALID", msg:error.message});
      return;
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("name email password ");
      if (!user) {
        res.send({code: "NOT_FOUND", msg:"User not found"});
        return;
      }

      const PassValid = await bcrypt.compare(password, user.password);
      if (!PassValid) {
        res.send({code: "WRONG_PASS", msg:"Invalid credentials"});
        return;
      }

      const UserOb = user.toObject();
      const { password: _, _id, ...UserRes } = UserOb;

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
        sameSite: "strict", // Protege contra ataques CSRF
        maxAge: 3600000, // 1 hora
      });
      
      res.send({ token: token, user: UserRes });
    } catch (error) {
      console.log(error);
    }
    
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.send({code: "LOGOUT", msg:"Logged out successfully"})

  }

  checkToken = async (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
         res.status(200).send({ authenticated: false });
         return;
      }
    
      try {
        jwt.verify(token, process.env.JWT_SECRET!);
        res.status(200).send({ authenticated: true });
      } catch (error) {
        res.status(200).send({ authenticated: false });
      }
  }
}

export const authControllers = new authController();
