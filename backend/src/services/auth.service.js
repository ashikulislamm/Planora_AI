import User from '../models/User.model.js';
import Task from '../models/Task.model.js';
import ApiError from '../utils/ApiError.js';
import generateToken from '../utils/generateToken.js';

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return { user, token };
  }

  /**
   * Login user and return user info + token
   */
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    return { user, token };
  }

  /**
   * Get user profile details
   */
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Update profile details (name and email)
   */
  async updateProfile(userId, { name, email }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(409, 'Email is already taken');
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();
    
    // Convert to object to trigger toJSON and remove password
    return user.toJSON();
  }

  /**
   * Update password after verifying current password
   */
  async updatePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(400, 'Incorrect current password');
    }

    user.password = newPassword;
    await user.save();
    return { success: true };
  }

  /**
   * Delete user account and all tasks belonging to them
   */
  async deleteAccount(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Delete all user's tasks
    await Task.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    return { success: true };
  }
}

export default new AuthService();
