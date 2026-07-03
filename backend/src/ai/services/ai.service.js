import geminiService from './gemini.service.js';
import { parseAiResponse } from '../parsers/response.parser.js';
import { SYSTEM_INSTRUCTION } from '../prompts/system.prompt.js';
import { TASK_PREVIEW_INSTRUCTION } from '../prompts/taskPreview.prompt.js';
import { PROJECT_PREVIEW_INSTRUCTION } from '../prompts/projectPreview.prompt.js';
import { sanitizeInput } from '../utils/aiResponseFormatter.js';
import ApiError from '../../utils/ApiError.js';
import logger from '../../utils/logger.js';
import { copilotTaskCreateSchema, copilotProjectCreateSchema } from '../validators/ai.validation.js';

// Strict Response Schemas to pass to Gemini Client for controlled decoding (Step 12)
const taskResponseSchema = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING', description: 'The summarized task title' },
    description: { type: 'STRING', description: 'Brief description of the task' },
    priority: { type: 'STRING', enum: ['low', 'medium', 'high', 'critical'] },
    status: { type: 'STRING', enum: ['todo', 'in-progress', 'done'] },
    category: { type: 'STRING', enum: ['work', 'personal', 'study', 'health'] },
    dueDate: { type: 'STRING', description: 'ISO-8601 date string or null' },
    dueTime: { type: 'STRING', description: 'Time format HH:MM or null' },
    estimatedDuration: { type: 'INTEGER', description: 'Estimated minutes for completion or null' },
    confidence: { type: 'NUMBER', description: 'Extraction confidence from 0.0 to 1.0' }
  },
  required: ['title', 'priority', 'status', 'category']
};

const projectResponseSchema = {
  type: 'OBJECT',
  properties: {
    projectTitle: { type: 'STRING', description: 'The title of the parent project task' },
    description: { type: 'STRING', description: 'High-level description of the project scope' },
    category: { type: 'STRING', enum: ['work', 'personal', 'study', 'health'] },
    priority: { type: 'STRING', enum: ['low', 'medium', 'high', 'critical'] },
    estimatedDuration: { type: 'INTEGER', description: 'Sum of subtask durations in minutes' },
    dueDate: { type: 'STRING', description: 'ISO-8601 date string or null' },
    subtasks: {
      type: 'ARRAY',
      description: 'List of sequential subtasks',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING', description: 'Concise subtask title' },
          description: { type: 'STRING', description: 'What is done in this step' },
          priority: { type: 'STRING', enum: ['low', 'medium', 'high', 'critical'] },
          estimatedDuration: { type: 'INTEGER', description: 'Duration in minutes' },
          dueDate: { type: 'STRING', description: 'ISO date string or null' },
          order: { type: 'INTEGER', description: 'Sequence order starting at 1' },
          dependsOn: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Subtask titles that must be completed first' }
        },
        required: ['title', 'priority', 'estimatedDuration', 'order']
      }
    }
  },
  required: ['projectTitle', 'subtasks']
};

class AiService {
  /**
   * Generates a standardized AI response for a user message request.
   * Used for general chatbot text interactions.
   * 
   * @param {string} message - User message
   * @returns {Promise<object>} Standardized parsed response: { raw, response, isJson }
   */
  async processUserMessage(message) {
    if (!message) {
      throw new ApiError(400, 'Message prompt is required');
    }

    // Sanitize input message
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      throw new ApiError(400, 'Message cannot be empty after sanitization');
    }

    // Call Gemini Service with default system instructions
    const rawResponse = await geminiService.generateText(sanitizedMessage, SYSTEM_INSTRUCTION);

    // Parse the response
    const parsedResult = parseAiResponse(rawResponse);

    // Return the standardized structure
    return {
      raw: parsedResult.raw,
      response: parsedResult.parsed,
      isJson: parsedResult.isJson,
    };
  }

  /**
   * Generates task preview with Zod validation, structured logging, and automatic retry.
   */
  async generateTaskPreview(message, timezone = 'UTC') {
    return await this.executeWithRetry('task', message, timezone);
  }

  /**
   * Generates project breakdown with Zod validation, structured logging, and automatic retry.
   */
  async generateProjectPreview(message, timezone = 'UTC') {
    return await this.executeWithRetry('project', message, timezone);
  }

  /**
   * Unified executor that coordinates Gemini calls, dev logging, defensive parsing,
   * Zod checks, and one-time auto-retry prompting.
   * 
   * @param {"task"|"project"} type - Proposal type
   * @param {string} message - User natural language prompt
   * @param {string} timezone - User's local timezone
   * @param {boolean} isRetry - Whether this is a retry query execution
   */
  async executeWithRetry(type, message, timezone = 'UTC', isRetry = false) {
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      throw new ApiError(400, 'Message cannot be empty after sanitization');
    }

    // 1. Resolve prompt template context
    const now = new Date();
    const currentDateStr = `${now.toISOString()} (${now.toLocaleDateString('en-US', { weekday: 'long' })})`;
    
    let systemInstruction = type === 'project' ? PROJECT_PREVIEW_INSTRUCTION : TASK_PREVIEW_INSTRUCTION;
    systemInstruction = systemInstruction
      .replace('{currentDate}', currentDateStr)
      .replace('{timezone}', timezone);

    // Prepare user prompt (adds error feedback if this is a retry attempt)
    const userPrompt = isRetry 
      ? `The previous response was not valid JSON. Please adjust and return ONLY valid raw JSON conforming strictly to the requested schema. Do NOT include markdown blocks. \nOriginal request: "${sanitizedMessage}"`
      : sanitizedMessage;

    if (process.env.NODE_ENV === 'development') {
      logger.info(`[AI Request] Mode: ${type} | Is Retry: ${isRetry} | Timezone: ${timezone}`);
    }

    // 2. Call Gemini Service (forces JSON output configuration)
    let rawResponse;
    try {
      const configOverrides = {
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temperature for determinism and fast speeds
      };

      rawResponse = await geminiService.generateText(userPrompt, systemInstruction, configOverrides);
    } catch (apiError) {
      logger.error(`[Gemini SDK Generation Error] type: ${type} | error: ${apiError.message}`);
      
      // Skip retry on 429 Rate Limit quotas to prevent unnecessary API spam
      if (!isRetry && apiError.statusCode !== 429) {
        logger.warn(`[AI SDK Error] Attempting automatic retry for ${type}...`);
        return await this.executeWithRetry(type, message, timezone, true);
      }
      throw new ApiError(apiError.statusCode || 502, apiError.message || 'The AI service encountered an error. Please try again.');
    }

    // Step 1 & 10: Development Raw Structured Logging
    if (process.env.NODE_ENV === 'development') {
      logger.info(`[AI Raw Response - Mode: ${type}]:\n${rawResponse}`);
    }

    // 3. Defensive Parsing & JSON Repair (Step 3 & 4)
    const parsedResult = parseAiResponse(rawResponse);
    
    if (process.env.NODE_ENV === 'development') {
      logger.info(`[AI Parser Result] isJson: ${parsedResult.isJson}`);
    }

    // Handle initial parsing failures
    if (!parsedResult.isJson || typeof parsedResult.parsed !== 'object' || parsedResult.parsed === null) {
      if (!isRetry) {
        logger.warn(`[AI Parsing Failed] Invalid JSON. Triggering automatic retry query for ${type}...`);
        return await this.executeWithRetry(type, message, timezone, true);
      }
      logger.error(`[AI Parser Unrecoverable Failure] Final raw output:\n${rawResponse}`);
      throw new ApiError(502, 'The AI returned an invalid structured response. Please try again.');
    }

    const data = parsedResult.parsed;

    // 4. Zod Schema Verification & Normalization (Step 5)
    try {
      if (type === 'project') {
        // Enforce lowercase enums for category and priority to pass strict validators
        if (data.category) data.category = String(data.category).toLowerCase();
        if (data.priority) data.priority = String(data.priority).toLowerCase();
        if (Array.isArray(data.subtasks)) {
          data.subtasks.forEach(s => {
            if (s.priority) s.priority = String(s.priority).toLowerCase();
            if (s.status) s.status = String(s.status).toLowerCase();
          });
        }

        // Transform flat AI response into nested structure expected by Zod schema
        const formattedData = {
          parentTask: {
            title: data.projectTitle,
            description: data.description,
            category: data.category,
            priority: data.priority,
            estimatedDuration: data.estimatedDuration,
            dueDate: data.dueDate,
          },
          subtasks: data.subtasks || []
        };

        // Zod validation check
        const validationResult = copilotProjectCreateSchema.shape.body.safeParse(formattedData);
        if (!validationResult.success) {
          logger.error(`[AI Schema Validation Failed - Project]: ${JSON.stringify(validationResult.error.errors)}`);
          throw new Error('Zod Schema validation failed');
        }

        const validatedData = validationResult.data;

        // Auto-calculate summary workload hours/days (Step 6 / Smart Features)
        const totalDuration = validatedData.subtasks.reduce((sum, s) => sum + (s.estimatedDuration || 0), 0);
        const estimatedHours = Math.round(totalDuration / 60) || 1;
        const estimatedDays = Math.ceil(estimatedHours / 6) || 1; // 6-hour workdays

        return {
          parentTask: {
            title: validatedData.parentTask.title,
            description: validatedData.parentTask.description || 'AI Project plan',
            priority: validatedData.parentTask.priority,
            category: validatedData.parentTask.category,
            status: 'todo',
            dueDate: validatedData.parentTask.dueDate || null,
            estimatedDuration: totalDuration,
          },
          subtasks: validatedData.subtasks.map((s, idx) => ({
            title: s.title,
            description: s.description || '',
            priority: s.priority,
            status: 'todo',
            dueDate: s.dueDate || null,
            estimatedDuration: s.estimatedDuration || 60,
            order: s.order || idx + 1,
            dependsOn: s.dependsOn || [],
          })),
          summary: {
            totalSubtasks: validatedData.subtasks.length,
            estimatedHours,
            estimatedDays,
          }
        };
      } else {
        // Enforce lowercase enums for task
        if (data.category) data.category = String(data.category).toLowerCase();
        if (data.priority) data.priority = String(data.priority).toLowerCase();
        if (data.status) data.status = String(data.status).toLowerCase();

        // Zod validation check
        const validationResult = copilotTaskCreateSchema.shape.body.safeParse(data);
        if (!validationResult.success) {
          logger.error(`[AI Schema Validation Failed - Task]: ${JSON.stringify(validationResult.error.errors)}`);
          throw new Error('Zod Schema validation failed');
        }

        const validatedData = validationResult.data;
        return {
          title: validatedData.title,
          description: validatedData.description || `Created from request: "${sanitizedMessage}"`,
          priority: validatedData.priority,
          status: validatedData.status,
          category: validatedData.category,
          dueDate: validatedData.dueDate || null,
          dueTime: validatedData.dueTime || null,
          estimatedDuration: validatedData.estimatedDuration || null,
          confidence: typeof data.confidence === 'number' ? Math.min(Math.max(data.confidence, 0), 1) : 0.85,
          editable: true,
        };
      }
    } catch (err) {
      // Trigger automatic retry once on schema validations fails
      if (!isRetry) {
        logger.warn(`[AI Schema Validation Failed] Attempting automatic retry query for ${type}...`);
        return await this.executeWithRetry(type, message, timezone, true);
      }
      logger.error(`[AI Schema Unrecoverable Failure] Output failed validation schema criteria.`);
      throw new ApiError(502, 'The AI returned an invalid structured response. Please try again.');
    }
  }

  /**
   * Checks the health of the underlying AI provider.
   */
  async checkHealth() {
    return await geminiService.checkHealth();
  }
}

export default new AiService();
