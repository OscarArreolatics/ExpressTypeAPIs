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
exports.taskServices = exports.taskService = void 0;
const task_1 = __importDefault(require("../models/task"));
class taskService {
    createTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTask = yield task_1.default.create(data);
                return newTask;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield task_1.default.find();
                return tasks;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskF = yield task_1.default.findById(id);
                if (!taskF) {
                    return "task not found";
                }
                return taskF;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateTask(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskU = yield task_1.default.findByIdAndUpdate(id, data, { new: true });
                if (!taskU) {
                    return "task not found";
                }
                return taskU;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taskD = yield task_1.default.findByIdAndDelete(id);
                if (!taskD) {
                    return "task not found";
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.taskService = taskService;
exports.taskServices = new taskService();
