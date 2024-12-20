import { Request, Response } from "express";
import { userServices } from "../services/userServices";
import { UserSchemaVali } from "../models/user";

class userController {
  addUser = async (req: Request, res: Response) => {
    const { error } = UserSchemaVali.validate(req.body);

    if (error) {
      res.send(error.message);
    } else {
      const task = await userServices.createUser(req.body);
      res.status(201).send(task);
    }
  };

  login = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await userServices.loginUser(id);
    res.send(task);
  };
}

export const userControllers = new userController();
