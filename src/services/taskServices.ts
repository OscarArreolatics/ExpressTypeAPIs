import Task from "../models/task";

export class taskService {
  async createTask(data: any) {
    try {
      const newTask = await Task.create(data);
      return newTask;
    } catch (error) {
      console.log(error);
    }
  }

  async getTasks() {
    try {
      const tasks = await Task.find();
      return tasks;
    } catch (error) {
      console.log(error);
    }
  }

  async getTask(id: string) {
    try {
      const taskF = await Task.findById(id);
      if (!taskF) {
        return "task not found";
      }
      return taskF;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(id: string, data: any) {
    try {
      const taskU = await Task.findByIdAndUpdate(id, data, { new: true });
      if (!taskU) {
        return "task not found";
      }
      return taskU;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTask(id: string) {
    try {
      const taskD = await Task.findByIdAndDelete(id);
      if (!taskD) {
        return "task not found";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const taskServices = new taskService();
