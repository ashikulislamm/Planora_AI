import 'dotenv/config';
import mongoose from 'mongoose';
import taskService from './services/task.service.js';
import connectDB from './config/db.js';
import Task from './models/Task.model.js';

async function run() {
  await connectDB();
  
  // Find a task that has subtasks
  const task = await Task.findOne({ title: "Integrate AI to Planora" });
  if (!task) {
    console.log('Task not found');
    await mongoose.connection.close();
    return;
  }
  
  console.log('--- DB Document ---');
  console.log(JSON.stringify(task, null, 2));
  
  const userId = task.userId;
  const tasks = await taskService.getAllTasks(userId);
  const targetTask = tasks.find(t => t._id.toString() === task._id.toString());
  
  console.log('--- getAllTasks Result ---');
  console.log(JSON.stringify(targetTask, null, 2));

  await mongoose.connection.close();
}

run().catch(console.error);
