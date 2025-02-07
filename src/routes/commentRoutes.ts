import { Router, Request, Response } from "express";
import { commentControllers } from "../controllers/commentController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// show all comments of a task
router.get("/:id", commentControllers.getComments);

// add comments
router.post("/:id", authMiddleware, commentControllers.addComment);

// delete comments
router.put("/delete/:id", authMiddleware, commentControllers.deleteComment);

// add comments
router.put("/update/:id", authMiddleware, commentControllers.editComment);

export default router;