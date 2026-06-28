import geminiService from './gemini.service.js';
import { parseAiResponse } from '../parsers/response.parser.js';
import { SYSTEM_INSTRUCTION } from '../prompts/system.prompt.js';
import { sanitizeInput } from '../utils/aiResponseFormatter.js';
import ApiError from '../../utils/ApiError.js';

class AiService {
  /**
   * Generates a standardized AI response for a user request.
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
   * Checks the health of the underlying AI provider.
   */
  async checkHealth() {
    return await geminiService.checkHealth();
  }
}

export default new AiService();
