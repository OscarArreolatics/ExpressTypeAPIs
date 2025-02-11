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
    try {
      const tasks = await Task.find()
        .populate({
          path: "projectId",
          select: "name color",
        })
        .populate({
          path: "assignedTo",
          select: "name",
          match: { _id: { $ne: null } }, // Esto asegura que solo se puebla si assignedTo no es null
        })
        .populate({
          path: "comments.userId",
          select: "name",
        })
      res.send(tasks);
    } catch (error) {
      console.log(error);
    }
  };

  getATask = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const taskF = await Task.findById(id)
        .populate({
          path: "projectId",
          select: "name color",
        })
        .populate({
          path: "assignedTo",
          select: "name",
          match: { _id: { $ne: null } }, // Esto asegura que solo se puebla si assignedTo no es null
        })
      if (!taskF) {
        res.send("task not found");
      }
      res.send(taskF);
    } catch (error) {
      console.log(error);
    }
  };

  getTasksByUser = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ code: "NOT_FOUND", msg: "User ID not found." });
      return;
    }

    try {
      const taskUsr = await Task.find({ assignedTo: userId })
        .populate({
          path: "projectId",
          select: "name color",
        })
        .populate({
          path: "assignedTo",
          select: "name",
          match: { _id: { $ne: null } }, // Esto asegura que solo se puebla si assignedTo no es null
        })
        .populate({
          path: "comments.userId",
          select: "name",
        });
      res.send(taskUsr);
    } catch (error) {
      console.log(error);
    }
  };

  getTasksByProject = async (req: Request, res: Response) => {
    const projectId = req.params.project;
    try {
      const taskP = await Task.find({ projectId: projectId })
        .populate({
          path: "projectId",
          select: "name color",
        })
        .populate({
          path: "assignedTo",
          select: "name",
          match: { _id: { $ne: null } }, // Esto asegura que solo se puebla si assignedTo no es null
        })
        .populate({
          path: "comments.userId",
          select: "name",
        });
      res.send(taskP);
    } catch (error) {
      console.log(error);
    }
  };

  updateTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const taskU = await Task.findByIdAndUpdate(id, req.body, { new: true });
      if (!taskU) {
        res.send({ code: "NOT_FOUND", msg: "task not found" });
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
        res.send({ code: "NOT_FOUND", msg: "task not found" });
      }
      res.send({ code: "COMPLETED", msg: "task delete" });
    } catch (error) {
      console.log(error);
    }
  };
}

export const taskControllers = new taskController();
