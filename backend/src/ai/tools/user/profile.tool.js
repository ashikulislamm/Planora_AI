import BaseTool from '../base.tool.js';
import authService from '../../../services/auth.service.js';

class UserProfileTool extends BaseTool {
  constructor() {
    super({
      name: 'get_user_profile',
      description: 'Get profile information of the authenticated user (name, email, dates).',
      category: 'user',
      parameters: {
        type: 'OBJECT',
        properties: {},
      },
    });
  }

  async run(input, user, metadata) {
    return await authService.getProfile(user._id);
  }
}

export default new UserProfileTool();
