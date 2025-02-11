import { Router, Request, Response } from "express";
import { projectControllers } from "../controllers/projectController";
import { authMiddleware, authRoles } from "../middleware/auth";

const router = Router();

// create project
router.post("/", authMiddleware, authRoles("admin", "editor"), projectControllers.addProject);

// show all project by user
router.get("/", authMiddleware, projectControllers.getProjects);

//show project
router.get("/:id", authMiddleware, projectControllers.getAProject);

// update project
router.put("/:id", authMiddleware, authRoles("admin", "editor", "user"), projectControllers.updateProject);

//delete project
router.delete("/:id", authMiddleware, authRoles("admin", "editor", "user"), projectControllers.deleteProject); 

export default router;