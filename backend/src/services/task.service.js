import Task from '../models/Task.model.js';
import ApiError from '../utils/ApiError.js';

class TaskService {
  /**
   * Create a new task for a user
   */
  async createTask(taskData, userId) {
    const task = await Task.create({
      ...taskData,
      userId,
    });
    return task;
  }

  /**
   * Get all tasks of the authenticated user with optional filtering/sorting
   */
  async getAllTasks(userId, query = {}) {
    const { status, priority, category, overdue, sort } = query;
    const queryObject = { userId };

    if (status) {
      queryObject.status = status;
    }
    if (priority) {
      queryObject.priority = priority;
    }
    if (category) {
      queryObject.category = category;
    }
    if (overdue === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      queryObject.dueDate = { $lt: today };
      queryObject.status = { $ne: 'done' };
    }

    let dbQuery = Task.find(queryObject);

    // Apply sorting in MongoDB
    if (sort === 'dueDate') {
      dbQuery = dbQuery.sort({ dueDate: 1, createdAt: -1 });
    } else if (sort === '-dueDate') {
      dbQuery = dbQuery.sort({ dueDate: -1, createdAt: -1 });
    } else {
      dbQuery = dbQuery.sort({ createdAt: -1 });
    }

    let tasks = await dbQuery.lean();

    // Custom sort in-memory for priorities
    if (sort === 'priority' || sort === '-priority') {
      const priorityWeights = {
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
      };
      tasks.sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 2;
        const weightB = priorityWeights[b.priority] || 2;
        return sort === 'priority' ? weightA - weightB : weightB - weightA;
      });
    }

    return tasks;
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(taskId, userId) {
    const task = await Task.findById(taskId).lean();
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Access denied. You do not own this task.');
    }

    return task;
  }

  /**
   * Update task fields (title, description, status, priority, dueDate, category)
   */
  async updateTask(taskId, updateData, userId) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Access denied. You do not own this task.');
    }

    // Apply allowed updates
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'category'];
    allowedUpdates.forEach((key) => {
      if (updateData[key] !== undefined) {
        task[key] = updateData[key];
      }
    });

    const updatedTask = await task.save();
    return updatedTask;
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId, userId) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Access denied. You do not own this task.');
    }

    await Task.findByIdAndDelete(taskId);
    return task;
  }

  /**
   * Add a log to a task
   */
  async addTaskLog(taskId, content, userId) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Access denied. You do not own this task.');
    }

    task.logs.push({ content });
    await task.save();
    return task;
  }

  /**
   * Delete a log from a task
   */
  async deleteTaskLog(taskId, logId, userId) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (task.userId.toString() !== userId.toString()) {
      throw new ApiError(403, 'Access denied. You do not own this task.');
    }

    task.logs = task.logs.filter((log) => log._id.toString() !== logId.toString());
    await task.save();
    return task;
  }
}

export default new TaskService();
