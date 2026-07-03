import mongoose from 'mongoose';
import connectDB from '../../config/db.js';
import aiService from '../services/ai.service.js';
import '../../models/User.model.js';
import '../../models/Task.model.js';

async function testProjectPreview() {
  console.log('=== AI Project Preview Generation Debug ===');
  await connectDB();
  
  const User = mongoose.model('User');
  const dummyUser = await User.findOne();
  if (!dummyUser) {
    console.error('No user found');
    await mongoose.connection.close();
    return;
  }
  
  try {
    const prompt = 'Build Backend API';
    console.log(`Sending project request: "${prompt}"...`);
    const previewDto = await aiService.generateProjectPreview(prompt, 'UTC');
    console.log('\n✅ Success! Preview generated:', JSON.stringify(previewDto, null, 2));
  } catch (error) {
    console.error('\n❌ Error generated during execution:', error);
    if (error.errors) {
      console.error('Error details:', error.errors);
    }
  }

  await mongoose.connection.close();
}

testProjectPreview().catch(console.error);
