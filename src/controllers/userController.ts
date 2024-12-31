import { Request, Response } from "express";
import { UserSchemaVali } from "../models/user";
import User from "../models/user";
import bcrypt from "bcryptjs";

class userController {
  addUser = async (req: Request, res: Response) => {
    const { error } = UserSchemaVali.validate(req.body);

    if (error) {
      res.send(error.message);
      return;
    }

    try {
      const { name, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const UserOb = newUser.toObject();
      const { password: _, _id, ...UserRes } = UserOb;

      res.status(201).send(UserRes);
    } catch (error) {
      console.log(error);
    }
  };
}

export const userControllers = new userController();
