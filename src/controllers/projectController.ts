import { Request, Response } from "express";
import { ProjectSchemaVali } from "../models/project";
import Project from "../models/project";
import { log } from "console";

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
        res.status(400).json({code: "NOT_FOUND", msg:"User ID not found."});
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
      res.status(400).json({code: "NOT_FOUND", msg:"User ID not found."});
      return;
    }

    try {
      const Projects = await Project.find({
        $or: [
          { createdBy: userId }, // Coincidencia en el campo createdBy
          { collaborators: userId }, // Coincidencia en el array collaborators
        ],
      });
      res.send(Projects);
    } catch (error) {
      console.log(error);
    }
  };

  getAProject = async (req: Request, res: Response) => {
    const id = req.params.id;

    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({code: "NOT_FOUND", msg:"User ID not found."});
      return;
    }

    try {
      const ProjectF = await Project.findById(id);
      if (!ProjectF) {
        res.send({code: "NOT_FOUND", msg:"Project not found"});
        return;
      }

      // Verifica si el userId está en createdBy o en collaborators
      const isAuthorized =
        ProjectF.createdBy.toString() === userId ||
        ProjectF.collaborators.some(
          (collaborator) => collaborator.toString() === userId
        );

      if (!isAuthorized) {
        res.status(403).send({code: "NOT_AUTHORIZED", msg:"Not authorized to access this project"});
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
      const ProjectU = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.send(ProjectU);
    } catch (error) {
      console.log(error);
    }
  };

  deleteProject = async (req: Request, res: Response) => {
    if (!(await this.ValProjectOwnerShip(req, res))) {
        return;
    }

    try {
      const ProjectD = await Project.findByIdAndDelete(req.params.id);
      if (!ProjectD) {
        res.send({code: "NOT_FOUND", msg:"Project not found"});
      }
      res.send({code: "COMPLETED", msg:"Project delete"});
    } catch (error) {
      console.log(error);
    }
  }; 

  ValProjectOwnerShip = async (req: Request, res: Response): Promise<boolean> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({code: "NOT_FOUND", msg:"User ID not found."});
      return false;
    }
  
    const projectId = req.params.id;
  
    if (!projectId || !/^[a-f\d]{24}$/i.test(projectId)) {
      res.status(400).json({code: "INVALID", msg:"Invalid project ID."});
      return false;
    }
  
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({code: "NOT_FOUND", msg:"Project not found"});
        return false;
      }
  
      if (project.createdBy.toString() !== userId) {
        res.status(403).json({code: "NOT_AUTHORIZED", msg:"Not authorized to access this project"});
        return false;
      }
  
      return true;
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
      return false;
    }
  }
}

export const projectControllers = new projectController();
