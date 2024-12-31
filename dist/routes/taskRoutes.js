"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// create task
router.post("/", taskController_1.taskControllers.addTask);
// show all tasks
router.get("/", auth_1.authMiddleware, taskController_1.taskControllers.getTasks);
//show task
router.get("/:id", taskController_1.taskControllers.getATask);
// update task
router.put("/:id", taskController_1.taskControllers.updateTask);
//delete task
router.delete("/:id", taskController_1.taskControllers.deleteTask);
exports.default = router;
