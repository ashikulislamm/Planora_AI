import { GoogleGenAI } from '@google/genai';
import ApiError from '../../utils/ApiError.js';
import logger from '../../utils/logger.js';
import { AI_CONSTANTS } from '../constants/ai.constants.js';

class GeminiService {
  constructor() {
    this.client = null;
    this.enabled = process.env.AI_ENABLED === 'true';
    this.model = process.env.GEMINI_MODEL || AI_CONSTANTS.DEFAULT_MODEL;
    this.temperature = process.env.GEMINI_TEMPERATURE 
      ? parseFloat(process.env.GEMINI_TEMPERATURE) 
      : AI_CONSTANTS.DEFAULT_TEMPERATURE;
    this.maxOutputTokens = process.env.GEMINI_MAX_OUTPUT_TOKENS 
      ? parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS, 10) 
      : AI_CONSTANTS.DEFAULT_MAX_TOKENS;
    this.timeoutMs = process.env.AI_TIMEOUT_MS 
      ? parseInt(process.env.AI_TIMEOUT_MS, 10) 
      : AI_CONSTANTS.DEFAULT_TIMEOUT_MS;
  }

  /**
   * Initializes the Google GenAI client if enabled and not already initialized.
   */
  initClient() {
    if (!this.enabled) {
      logger.warn('AI Service is disabled via AI_ENABLED env variable.');
      return;
    }

    if (this.client) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('GEMINI_API_KEY is missing from environment variables.');
      throw new ApiError(500, 'AI API key configuration is missing.');
    }

    try {
      this.client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          timeout: this.timeoutMs,
        },
      });
      logger.info('Gemini Client initialized successfully.');
    } catch (error) {
      logger.error('Failed to initialize Gemini Client:', error);
      throw new ApiError(500, 'Failed to initialize AI Service client.');
    }
  }

  /**
   * Generates content from the Gemini model.
   * @param {string} prompt - The user prompt
   * @param {string} systemInstruction - The system instruction/prompt
   * @returns {Promise<string>} The generated text response
   */
  async generateText(prompt, systemInstruction) {
    if (!this.enabled) {
      throw new ApiError(503, 'AI service is disabled');
    }

    // Lazy initialization of client
    this.initClient();

    if (!this.client) {
      throw new ApiError(500, 'AI client is not initialized');
    }

    try {
      // Define a timeout promise as a safety fallback for hanging connections
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new ApiError(408, 'AI generation request timed out'));
        }, this.timeoutMs);
      });

      // Call models.generateContent from @google/genai SDK
      const generationPromise = this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: this.temperature,
          maxOutputTokens: this.maxOutputTokens,
        },
      });

      // Race generation against timeout
      const response = await Promise.race([generationPromise, timeoutPromise]);

      if (!response || !response.text) {
        throw new ApiError(502, 'Received empty response from AI model');
      }

      return response.text;
    } catch (error) {
      logger.error('Gemini Service generation error:', error);

      if (error instanceof ApiError) {
        throw error;
      }

      // Handle rate limits or other Gemini API specific errors
      const status = error.status || 500;
      let message = 'AI service error occurred';

      if (error.status === 429) {
        message = 'AI rate limit exceeded. Please try again later.';
        throw new ApiError(429, message);
      }

      if (error.status === 400) {
        message = 'Invalid request parameters for AI service';
        throw new ApiError(400, message);
      }

      if (error.status === 403 || error.status === 401) {
        message = 'Authentication failed for AI service';
        throw new ApiError(401, message);
      }

      throw new ApiError(status, error.message || message);
    }
  }

  /**
   * Health check for the Gemini service.
   * Checks if service is enabled and API connectivity.
   */
  async checkHealth() {
    if (!this.enabled) {
      return {
        status: 'disabled',
        provider: 'Gemini',
        model: this.model,
      };
    }

    try {
      this.initClient();
      
      // Perform a minimal, fast generation call to test connectivity
      await this.generateText('healthcheck_ping', 'You are a healthcheck bot. Reply only with the word OK.');
      
      return {
        status: 'healthy',
        provider: 'Gemini',
        model: this.model,
      };
    } catch (error) {
      logger.error('Gemini Service health check failed:', error);
      return {
        status: 'unhealthy',
        provider: 'Gemini',
        model: this.model,
        error: error.message || 'AI service check failed',
      };
    }
  }
}

export default new GeminiService();
