import ApiError from '../../utils/ApiError.js';
import logger from '../../utils/logger.js';

/**
 * Base class for all AI Tools in the Planora platform.
 * Provides unified logic for input validation, authentication guards,
 * standardized responses, error mapping, and execution logging.
 */
class BaseTool {
  constructor({ name, description, parameters = {}, category }) {
    this.name = name;
    this.description = description;
    this.parameters = parameters; // JSON Schema for Gemini Compatibility
    this.category = category;
    this.schema = null; // Zod schema for input validation, optional
  }

  /**
   * Main execution flow wrapper
   * @param {object} input - Input arguments
   * @param {object} user - Authenticated user details
   * @param {object} metadata - Context metadata
   * @returns {Promise<object>} Standard tool response
   */
  async execute(input = {}, user, metadata = {}) {
    const startTime = Date.now();

    try {
      // 1. Enforce authentication
      if (!user || !user._id) {
        throw new ApiError(401, 'User authentication is required to run this AI tool');
      }

      // 2. Validate input using Zod if defined
      let validatedInput = input;
      if (this.schema) {
        const parseResult = this.schema.safeParse(input);
        if (!parseResult.success) {
          const errors = parseResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          throw new ApiError(400, 'Tool input validation failed', errors);
        }
        validatedInput = parseResult.data;
      }

      // 3. Execute tool-specific logic
      const data = await this.run(validatedInput, user, metadata);
      const executionTime = Date.now() - startTime;

      // 4. Log successful execution
      this.logExecution({
        userId: user._id,
        success: true,
        executionTime,
        metadata,
      });

      // 5. Return standardised success response
      return {
        success: true,
        tool: this.name,
        message: `${this.name} executed successfully`,
        data,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Log failure
      this.logExecution({
        userId: user ? user._id : null,
        success: false,
        executionTime,
        error,
        metadata,
      });

      const statusCode = error.statusCode || 500;
      const message = error.message || 'An unexpected error occurred in tool execution';

      // Return standardised failure response
      return {
        success: false,
        tool: this.name,
        message,
        error: {
          statusCode,
          errors: error.errors || [],
          stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
        },
      };
    }
  }

  /**
   * Internal execution logic - must be implemented by concrete tools
   */
  async run(input, user, metadata) {
    throw new Error('Tool run method not implemented');
  }

  /**
   * Structured logging helper for tool observability
   */
  logExecution({ userId, success, executionTime, error, metadata }) {
    const logData = {
      tool: this.name,
      userId: userId ? userId.toString() : null,
      success,
      executionTimeMs: executionTime,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    if (success) {
      logger.info(`AI Tool Executed: ${this.name} | User: ${userId} | Status: Success | Time: ${executionTime}ms`, logData);
    } else {
      logger.error(`AI Tool Failed: ${this.name} | User: ${userId} | Status: Failure | Error: ${error.message} | Time: ${executionTime}ms`, {
        ...logData,
        errorMessage: error.message,
        errorStack: error.stack,
      });
    }
  }
}

export default BaseTool;
