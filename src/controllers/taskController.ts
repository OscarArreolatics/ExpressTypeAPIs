import { taskServices } from "../services/taskServices";
import { Request, Response } from "express";
import { TaskSchemaVali } from "../models/task";

class taskController {
  addTask = async (req: Request, res: Response) => {
    const {error} = TaskSchemaVali.validate(req.body)


    if (error) {
      res.send(error.message)
    } else {
      const task = await taskServices.createTask(req.body);
      res.status(201).send(task);
    }
  };

  getTasks = async (req: Request, res: Response) => {
    const tasks = await taskServices.getTasks();
    res.send(tasks);
  };

  getATask = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await taskServices.getTask(id);
    res.send(task);
  };

  updateTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    const task = await taskServices.updateTask(id, req.body);
    res.send(task);
  };

  deleteTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    await taskServices.deleteTask(id);
    res.send("task delete");
  };
}

export const taskControllers = new taskController();
