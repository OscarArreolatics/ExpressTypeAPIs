import { Request, Response } from "express";
import Task from "../models/task";
import { CommentSchemaVali } from "../models/task";

class commentController {
  getComments = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const tasks = await Task.findById(id)
        .select("comments -_id")
        .populate({
          path: "comments.userId",
          select: "name",
        })
        .sort({ "comments.timestamp": -1 });
      res.send(tasks?.comments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  };

  addComment = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { error } = CommentSchemaVali.validate(req.body);

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
      data.userId = userId;

      const taskU = await Task.findByIdAndUpdate(
        id,
        { $push: { comments: data } },
        { new: true }
      );
      if (!taskU) {
        res.send("task not found");
      }
      res.send(taskU);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  };

  editComment = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ code: "NOT_FOUND", msg: "User ID not found." });
        return;
      }

      const taskId = req.params.id;
      const { comment, commentId } = req.body;

      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, "comments._id": commentId },
        {
          $set: {
            "comments.$.comment": comment,
          },
        },
        { new: true }
      );

      if (!updatedTask) {
        res.status(400).json({ code: "NOT_FOUND", msg: "task or Comment not found." });
        return;
      }

      res.send({ code: "COMPLETED", msg: "comment update" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  };

  deleteComment = async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const commentId = req.body.commentId;
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ code: "NOT_FOUND", msg: "User ID not found." });
        return;
      }

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );

      if (!updatedTask) {
        res.status(400).json({ code: "NOT_FOUND", msg: "task not found" });
        return;
      }

      res.send({ code: "COMPLETED", msg: "comment delete" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  };
}

export const commentControllers = new commentController();
