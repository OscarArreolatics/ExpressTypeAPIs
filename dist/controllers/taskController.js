"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskControllers = void 0;
const task_1 = require("../models/task");
const task_2 = __importDefault(require("../models/task"));
class taskController {
    constructor() {
        this.addTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { error } = task_1.TaskSchemaVali.validate(req.body);
            if (error) {
                res.send(error.message);
                return;
            }
            try {
                const newTask = yield task_2.default.create(req.body);
                res.status(201).send(newTask);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getTasks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(400).json({ error: "User ID not found." });
                return;
            }
            try {
                const tasks = yield task_2.default.find({ userId });
                res.json({ tasks });
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch tasks." });
            }
        });
        this.getATask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const taskF = yield task_2.default.findById(id);
                if (!taskF) {
                    res.send("task not found");
                }
                res.send(taskF);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.updateTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const taskU = yield task_2.default.findByIdAndUpdate(id, req.body, { new: true });
                if (!taskU) {
                    res.send("task not found");
                }
                res.send(taskU);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.deleteTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const taskD = yield task_2.default.findByIdAndDelete(id);
                if (!taskD) {
                    res.send("task not found");
                }
                res.send("task delete");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.taskControllers = new taskController();
