import { Request, Response } from "express";
import { ProjectSchemaVali } from "../models/project";
import mongoose from "mongoose";
import Project from "../models/project";
import Task from "../models/task";

class projectController {
  addProject = async (req: Request, res: Response) => {
    const { error } = ProjectSchemaVali.validate(req.body);

    if (error) {
      res.send(error.message);
      return;
    }

    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ code: "NOT_FOUND", msg: "User ID not found." });
        return;
      }

      let data = req.body;
      data.createdBy = userId;

      const newProject = await Project.create(data);
      res.status(201).send(newProject);
    } catch (error) {
      console.log(error);
    }
  };

  getProjects = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ code: "NOT_FOUND", msg: "User ID not found." });
      return;
    }

    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const Projects = await Project.aggregate([
        {
          $match: {
            $or: [{ createdBy: userObjectId }, { collaborators: userObjectId }],
          },
        },
        {
          $lookup: {
            from: "tasks", // Nombre de la colección de tareas
            localField: "_id", // Campo del proyecto relacionado
            foreignField: "projectId", // Campo de la tarea que referencia el proyecto
            as: "tasks",
          },
        },
        {
          $addFields: {
            incompleteTasks: {
              $size: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: { $ne: ["$$task.status", "completado"] }, // Tareas no completadas
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "users", // Nombre de la colección de usuarios
            localField: "collaborators", // Campo de referencia en el proyecto
            foreignField: "_id", // Campo del usuario que corresponde
            as: "collaborators", // Nombre del nuevo campo con los datos poblados
          },
        },
        {
          $project: {
            tasks: 0, // Excluir el array de tareas si no es necesario
            "collaborators.password": 0, // Excluir campos sensibles si es necesario
            "collaborators.email": 0,
            "collaborators.createdAt": 0,
            "collaborators.updatedAt": 0,
          },
        },
      ]);

      res.send(Projects);
    } catch (error) {
      console.log(error);
    }
  };

  getAProject = async (req: Request, res: Response) => {
    const id = req.params.id;

    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ code: "NOT_FOUND", msg: "User ID not found." });
      return;
    }

    try {
      const ProjectF = await Project.findById(id)
        .populate({
          path: "createdBy",
          select: "name",
        })
        .populate({
          path: "collaborators",
          select: "name",
          match: { _id: { $ne: null } }, // Esto asegura que solo se puebla si assignedTo no es null
        });
      if (!ProjectF) {
        res.send({ code: "NOT_FOUND", msg: "Project not found" });
        return;
      }

      // Verifica si el userId está en createdBy o en collaborators
      const isAuthorized =
        ProjectF.createdBy._id.toString() === userId ||
        ProjectF.collaborators.some(
          (collaborator) => collaborator.toString() === userId
        );

      if (!isAuthorized) {
        res.status(403).send({
          code: "NOT_AUTHORIZED",
          msg: "Not authorized to access this project",
        });
        return;
      }
      res.send(ProjectF);
    } catch (error) {
      console.log(error);
    }
  };

  updateProject = async (req: Request, res: Response) => {
    if (!(await this.ValProjectOwnerShip(req, res))) {
      return;
    }

    try {
      const ProjectU = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.send(ProjectU);
    } catch (error) {
      console.log(error);
    }
  };

  deleteProject = async (req: Request, res: Response) => {
    if (!(await this.ValProjectOwnerShip(req, res))) {
      return;
    }
    const { id: projectId } = req.params;

    try {
      const ProjectD = await Project.findByIdAndDelete(projectId);
      if (!ProjectD) {
        res.send({ code: "NOT_FOUND", msg: "Project not found" });
      }
      const result = await Task.deleteMany({ projectId });

      res.send({ code: "COMPLETED", msg: "Project delete" });
    } catch (error) {
      console.log(error);
    }
  };

  ValProjectOwnerShip = async (
    req: Request,
    res: Response
  ): Promise<boolean> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ code: "NOT_FOUND", msg: "User ID not found." });
      return false;
    }

    const projectId = req.params.id;

    if (!projectId || !/^[a-f\d]{24}$/i.test(projectId)) {
      res.status(400).json({ code: "INVALID", msg: "Invalid project ID." });
      return false;
    }

    try {
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({ code: "NOT_FOUND", msg: "Project not found" });
        return false;
      }

      if (project.createdBy.toString() !== userId) {
        res.status(403).json({
          code: "NOT_AUTHORIZED",
          msg: "Not authorized to access this project",
        });
        return false;
      }

      return true;
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
      return false;
    }
  };
}

export const projectControllers = new projectController();
