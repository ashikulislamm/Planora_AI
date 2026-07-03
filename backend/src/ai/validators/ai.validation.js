import { z } from 'zod';

export const testAiSchema = z.object({
  body: z.object({
    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(1, 'Message cannot be empty')
      .max(2000, 'Message cannot exceed 2000 characters'),
  }),
});

export const copilotTaskPreviewSchema = z.object({
  body: z.object({
    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(1, 'Message cannot be empty')
      .max(2000, 'Message cannot exceed 2000 characters'),
    timezone: z.string().optional().default('UTC'),
  }),
});

export const copilotTaskCreateSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Task title is required' })
      .trim()
      .min(1, 'Task title cannot be empty')
      .max(100, 'Task title cannot exceed 100 characters'),
    description: z.string().trim().optional(),
    status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    category: z.enum(['work', 'personal', 'study', 'health']).default('work'),
    dueDate: z
      .string()
      .datetime()
      .optional()
      .nullable()
      .or(z.string().date().optional().nullable())
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).optional().nullable()), // supports datetime-local inputs
    dueTime: z.string().optional().nullable(),
    estimatedDuration: z.coerce.number().int().positive().optional().nullable(),
  }),
});

export const copilotProjectPreviewSchema = z.object({
  body: z.object({
    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(1, 'Message cannot be empty')
      .max(2000, 'Message cannot exceed 2000 characters'),
    timezone: z.string().optional().default('UTC'),
  }),
});

export const copilotProjectCreateSchema = z.object({
  body: z.object({
    parentTask: z.object({
      title: z
        .string({ required_error: 'Parent task title is required' })
        .trim()
        .min(1, 'Parent task title cannot be empty')
        .max(100, 'Parent task title cannot exceed 100 characters'),
      description: z.string().trim().optional(),
      status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
      category: z.enum(['work', 'personal', 'study', 'health']).default('work'),
      dueDate: z
        .string()
        .datetime()
        .optional()
        .nullable()
        .or(z.string().date().optional().nullable())
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).optional().nullable()),
      dueTime: z.string().optional().nullable(),
      estimatedDuration: z.coerce.number().int().positive().optional().nullable(),
    }),
    subtasks: z
      .array(
        z.object({
          title: z
            .string({ required_error: 'Subtask title is required' })
            .trim()
            .min(1, 'Subtask title cannot be empty'),
          description: z.string().trim().optional(),
          status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
          priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
          dueDate: z
            .string()
            .datetime()
            .optional()
            .nullable()
            .or(z.string().date().optional().nullable())
            .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).optional().nullable()),
          dueTime: z.string().optional().nullable(),
          estimatedDuration: z.coerce.number().int().positive().optional().nullable(),
          order: z.number().int().positive().optional(),
          dependsOn: z.array(z.string()).optional().default([]),
        })
      )
      .min(1, 'Project breakdown must contain at least one subtask')
      .max(15, 'Project breakdown cannot exceed 15 subtasks'),
  }),
});
