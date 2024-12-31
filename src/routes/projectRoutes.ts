import { Router, Request, Response } from "express";
import { projectControllers } from "../controllers/projectController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// create project
router.post("/", authMiddleware, projectControllers.addProject);

// show all project by user
router.get("/", authMiddleware, projectControllers.getProjects);

//show project
router.get("/:id", authMiddleware, projectControllers.getAProject);

// update project
router.put("/:id", authMiddleware, projectControllers.updateProject);

//delete project
router.delete("/:id", authMiddleware, projectControllers.deleteProject); 

export default router;