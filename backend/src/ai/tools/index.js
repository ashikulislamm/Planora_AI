import registry from './registry.js';

// Task Domain Tools
import createTaskTool from './task/create-task.tool.js';
import updateTaskTool from './task/update-task.tool.js';
import deleteTaskTool from './task/delete-task.tool.js';
import getTaskTool from './task/get-task.tool.js';
import listTasksTool from './task/list-tasks.tool.js';
import changeStatusTool from './task/change-status.tool.js';
import changePriorityTool from './task/change-priority.tool.js';
import updateDueDateTool from './task/update-due-date.tool.js';
import archiveTaskTool from './task/archive-task.tool.js';
import restoreTaskTool from './task/restore-task.tool.js';

// Project Domain Tools
import createSubtasksTool from './project/create-subtasks.tool.js';
import createProjectTool from './project/create-project.tool.js';
import calculateProgressTool from './project/calculate-progress.tool.js';

// Focus Domain Tools
import startFocusTool from './focus/start-focus.tool.js';
import stopFocusTool from './focus/stop-focus.tool.js';
import activeSessionTool from './focus/active-session.tool.js';
import focusHistoryTool from './focus/focus-history.tool.js';

// Analytics Domain Tools
import analyticsDashboardTool from './analytics/dashboard.tool.js';
import completionRateTool from './analytics/completion-rate.tool.js';
import weeklySummaryTool from './analytics/weekly-summary.tool.js';
import monthlySummaryTool from './analytics/monthly-summary.tool.js';

// User Domain Tools
import userProfileTool from './user/profile.tool.js';
import updateProfileTool from './user/update-profile.tool.js';
import userDashboardTool from './user/dashboard.tool.js';

// Activity Domain Tools
import recentActivitiesTool from './activity/recent-activities.tool.js';
import activitySummaryTool from './activity/activity-summary.tool.js';

// List of all tools to register during startup
const tools = [
  createTaskTool,
  updateTaskTool,
  deleteTaskTool,
  getTaskTool,
  listTasksTool,
  changeStatusTool,
  changePriorityTool,
  updateDueDateTool,
  archiveTaskTool,
  restoreTaskTool,

  createSubtasksTool,
  createProjectTool,
  calculateProgressTool,

  startFocusTool,
  stopFocusTool,
  activeSessionTool,
  focusHistoryTool,

  analyticsDashboardTool,
  completionRateTool,
  weeklySummaryTool,
  monthlySummaryTool,

  userProfileTool,
  updateProfileTool,
  userDashboardTool,

  recentActivitiesTool,
  activitySummaryTool,
];

// Register all tools automatically
tools.forEach((tool) => registry.register(tool));

export { registry };
export default registry;
