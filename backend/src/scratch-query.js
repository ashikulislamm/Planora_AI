import 'dotenv/config';
import mongoose from 'mongoose';
import Task from './models/Task.model.js';
import connectDB from './config/db.js';

async function run() {
  await connectDB();
  const tasks = await Task.find({});
  console.log('--- MONGOOSE DOCUMENTS ---');
  for (const t of tasks) {
    console.log(`Task: "${t.title}"`);
    console.log(`Status: ${t.status}`);
    console.log(`Subtasks length: ${t.subtasks?.length}`);
    console.log(`Virtual progressPercentage: ${t.progressPercentage}`);
    console.log(`JSON progressPercentage: ${t.toJSON().progressPercentage}`);
    console.log(`Subtasks completed count: ${t.subtasks?.filter(s => s.completed).length}`);
    console.log('Subtasks detailed:', t.subtasks.map(s => ({ title: s.title, completed: s.completed })));
    console.log('---------------------------');
  }
  await mongoose.connection.close();
}

run().catch(console.error);
