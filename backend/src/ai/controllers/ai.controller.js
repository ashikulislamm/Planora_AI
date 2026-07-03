import mongoose from 'mongoose';
import aiService from '../services/ai.service.js';
import registry from '../tools/index.js';
import activityService from '../../services/activity.service.js';
import { formatAiSuccess } from '../utils/aiResponseFormatter.js';
import ApiError from '../../utils/ApiError.js';
import asyncHandler from '../../utils/asyncHandler.js';

/**
 * Test AI Service connectivity
 * POST /api/ai/test
 */
export const testAi = asyncHandler(async (req, res) => {
  const { message } = req.body;

  try {
    const result = await aiService.processUserMessage(message);
    
    // Output: { success: true, data: { response: "..." } }
    res.status(200).json(formatAiSuccess(null, { response: result.response }));
  } catch (error) {
    // If it's a timeout error or service error, translate to appropriate error status/message
    if (error.statusCode === 408 || error.statusCode === 503 || error.statusCode === 502) {
      throw new ApiError(error.statusCode, 'AI service unavailable', error.errors);
    }
    throw error;
  }
});

/**
 * Check AI Service Health
 * GET /api/ai/health
 */
export const checkAiHealth = asyncHandler(async (req, res) => {
  const health = await aiService.checkHealth();

  if (health.status === 'unhealthy') {
    throw new ApiError(503, 'AI service unavailable');
  }

  res.status(200).json({
    success: true,
    provider: health.provider,
    model: health.model,
    status: health.status,
  });
});

/**
 * Generate a task preview DTO from a natural language prompt
 * POST /api/ai/copilot/task-preview
 */
export const getTaskPreview = asyncHandler(async (req, res) => {
  const { message, timezone } = req.body;
  const previewDto = await aiService.generateTaskPreview(message, timezone);
  res.status(200).json(formatAiSuccess('Task preview generated successfully', previewDto));
});

/**
 * Create a task from the user-approved preview data using the Tool Layer
 * POST /api/ai/copilot/task-create
 */
export const createTaskFromPreview = asyncHandler(async (req, res) => {
  // Execute the create_task tool in the registry
  const result = await registry.execute('create_task', req.body, req.user);

  if (!result.success) {
    const errorDetails = result.error || {};
    throw new ApiError(
      errorDetails.statusCode || 400,
      result.message || 'Failed to create task from preview',
      errorDetails.errors || []
    );
  }

  // Success response containing the created task
  res.status(201).json(formatAiSuccess('Task created successfully', result.data));
});

/**
 * Generate project and subtasks breakdown preview from a natural language prompt
 * POST /api/ai/copilot/project-preview
 */
export const getProjectPreview = asyncHandler(async (req, res) => {
  const { message, timezone } = req.body;
  const projectDto = await aiService.generateProjectPreview(message, timezone);
  res.status(200).json(formatAiSuccess('Project plan generated successfully', projectDto));
});

/**
 * Atomically create parent task and subtask hierarchy in a transaction
 * POST /api/ai/copilot/project-create
 */
export const createProjectFromPreview = asyncHandler(async (req, res) => {
  const { parentTask, subtasks } = req.body;
  const userId = req.user._id;

  let session = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    useTransaction = true;
  } catch (sessionErr) {
    session = null;
    useTransaction = false;
  }

  try {
    const transactionOpts = useTransaction ? { session } : {};

    // 1. Pack the subtasks inline inside the parent task to enable native atomic save.
    // This provides a resilient single-document insert, making rollback automatic 
    // even if database does not run as replica sets!
    const taskPayload = {
      ...parentTask,
      subtasks: subtasks.map(s => ({
        title: s.title,
        description: s.description,
        priority: s.priority,
        estimatedDuration: s.estimatedDuration,
        dueDate: s.dueDate,
        order: s.order,
        dependsOn: s.dependsOn,
        completed: false
      }))
    };

    // 2. Call the Tool Layer to create the task
    const parentResult = await registry.execute('create_task', taskPayload, req.user, transactionOpts);

    if (!parentResult.success) {
      const errorDetails = parentResult.error || {};
      throw new ApiError(
        errorDetails.statusCode || 400,
        parentResult.message || 'Failed to create parent task',
        errorDetails.errors || []
      );
    }

    const createdParent = parentResult.data;

    // 3. Log specialized project timeline activities
    await activityService.logActivity(
      userId,
      createdParent._id,
      'project_created_ai',
      {
        title: createdParent.title,
        subtasksCount: createdParent.subtasks.length,
        estimatedHours: Math.round(createdParent.estimatedDuration / 60)
      }
    );

    // Commit transaction if active
    if (useTransaction) {
      await session.commitTransaction();
    }

    res.status(201).json(formatAiSuccess('Project created successfully', {
      parentTask: createdParent,
      subtasks: createdParent.subtasks
    }));
  } catch (err) {
    if (useTransaction && session) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    if (session) {
      session.endSession();
    }
  }
});
