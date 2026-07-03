import { z } from 'zod';
import BaseTool from '../base.tool.js';
import authService from '../../../services/auth.service.js';

class UpdateProfileTool extends BaseTool {
  constructor() {
    super({
      name: 'update_user_profile',
      description: 'Update user profile details such as name or email (validated for uniqueness).',
      category: 'user',
      parameters: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', description: 'New name for the user' },
          email: { type: 'STRING', description: 'New email address for the user' },
        },
      },
    });

    this.schema = z.object({
      name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
      email: z.string().trim().email('Invalid email format').optional(),
    }).refine((data) => data.name || data.email, {
      message: 'Either name or email must be provided to update profile',
    });
  }

  async run(input, user, metadata) {
    return await authService.updateProfile(user._id, input);
  }
}

export default new UpdateProfileTool();
