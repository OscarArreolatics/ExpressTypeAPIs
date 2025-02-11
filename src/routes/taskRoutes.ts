import { Router, Request, Response } from "express";
import { taskControllers } from "../controllers/taskController";
import { authMiddleware, authRoles } from "../middleware/auth";

const router = Router();

// create task
router.post("/", authMiddleware, taskControllers.addTask);

// show all tasks
router.get("/", taskControllers.getTasks);

// show all tasks by project
router.get("/project/:project", authMiddleware, taskControllers.getTasksByProject);

// show all tasks by user
router.get("/user", authMiddleware, taskControllers.getTasksByUser);

//show task
router.get("/:id", authMiddleware,taskControllers.getATask);

// update task
router.put("/:id", authMiddleware, taskControllers.updateTask);

//delete task
router.delete("/:id", authMiddleware, authRoles("admin", "editor"), taskControllers.deleteTask);

export default router;
