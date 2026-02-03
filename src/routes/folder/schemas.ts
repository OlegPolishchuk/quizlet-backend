import { z } from 'zod';

export const createFolderBodySchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  description: z.string().trim().optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC']).optional().default('PRIVATE'),
});

export const folderIdParamsSchema = z.object({
  folderId: z.string().min(1), // если у тебя cuid: можно заменить на z.string().cuid()
});

export const updateFolderBodySchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    visibility: z.enum(['PRIVATE', 'PUBLIC']).optional(),
  })
  .strict();

export type UpdateFolderBodySchema = z.infer<typeof updateFolderBodySchema>;
