import { Request, Response } from "express";
import { TaskSchemaVali } from "../models/task";
import Task from "../models/task";

class taskController {
  addTask = async (req: Request, res: Response) => {
    const { error } = TaskSchemaVali.validate(req.body);

    if (error) {
      res.send(error.message);
      return;
    }
    try {
      const newTask = await Task.create(req.body);
      res.status(201).send(newTask);
    } catch (error) {
      console.log(error);
    }
  };

  getTasks = async (req: Request, res: Response) => {
/*     const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ error: "User ID not found." });
      return;
    } */

    try {
      const tasks = await Task.find();
      res.send(tasks);
    } catch (error) {
      console.log(error);
    }
  };

  getATask = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const taskF = await Task.findById(id);
      if (!taskF) {
        res.send("task not found");
      }
      res.send(taskF);
    } catch (error) {
      console.log(error);
    }
  };

  updateTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const taskU = await Task.findByIdAndUpdate(id, req.body, { new: true });
      if (!taskU) {
        res.send("task not found");
      }
      res.send(taskU);
    } catch (error) {
      console.log(error);
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const taskD = await Task.findByIdAndDelete(id);
      if (!taskD) {
        res.send("task not found");
      }
      res.send("task delete");
    } catch (error) {
      console.log(error);
    }
  };
}

export const taskControllers = new taskController();
