import aiService from '../services/ai.service.js';
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
