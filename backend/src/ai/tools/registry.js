import logger from '../../utils/logger.js';

/**
 * Registry to hold and execute all registered AI Tools.
 */
class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  /**
   * Register a tool instance
   * @param {BaseTool} tool - Tool class instance
   */
  register(tool) {
    if (!tool.name) {
      throw new Error('Cannot register tool without a name');
    }
    if (this.tools.has(tool.name)) {
      logger.warn(`Overwriting already registered tool: ${tool.name}`);
    }
    this.tools.set(tool.name, tool);
    logger.info(`AI Tool Registered: ${tool.name} [Category: ${tool.category}]`);
  }

  /**
   * Unregister a tool by name
   * @param {string} name - Name of tool
   */
  unregister(name) {
    const deleted = this.tools.delete(name);
    if (deleted) {
      logger.info(`AI Tool Unregistered: ${name}`);
    }
  }

  /**
   * Find a tool by name
   * @param {string} name - Name of tool
   * @returns {BaseTool|undefined} Tool instance
   */
  find(name) {
    return this.tools.get(name);
  }

  /**
   * List all registered tools with metadata
   * @returns {Array<object>} List of tool definitions
   */
  list() {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      category: tool.category,
    }));
  }

  /**
   * List all registered tools in a specific category
   * @param {string} category - Category string
   * @returns {Array<object>} List of matching tools
   */
  listByCategory(category) {
    return this.list().filter((tool) => tool.category === category);
  }

  /**
   * Execute a tool by name
   * @param {string} name - Tool name
   * @param {object} input - Input arguments for the tool
   * @param {object} user - Authenticated user details
   * @param {object} metadata - Context metadata
   * @returns {Promise<object>} Standard tool response
   */
  async execute(name, input, user, metadata = {}) {
    const tool = this.find(name);
    if (!tool) {
      return {
        success: false,
        tool: name,
        message: `Tool "${name}" not found in registry`,
        error: {
          statusCode: 404,
          errors: [],
        },
      };
    }
    return await tool.execute(input, user, metadata);
  }
}

export default new ToolRegistry();
