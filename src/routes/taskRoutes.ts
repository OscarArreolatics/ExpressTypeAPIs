import { Router, Request, Response } from "express";
import { taskControllers } from "../controllers/taskController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// create task
router.post("/", taskControllers.addTask);

// show all tasks
router.get("/", taskControllers.getTasks);

//show task
router.get("/:id", taskControllers.getATask);

// update task
router.put("/:id", taskControllers.updateTask);

//delete task
router.delete("/:id", taskControllers.deleteTask);

export default router;
