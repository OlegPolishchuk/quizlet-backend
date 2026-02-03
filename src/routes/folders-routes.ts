import { getAuth } from '@clerk/express';
import { type Request, type Response, Router } from 'express';
import { z } from 'zod';

import { unauthorizedException } from '../exceptions/exceptions.js';
import { Folder } from '../generated/prisma/client.js';
import { folderService } from '../services/folder/folder.service.js';
import { ListResponse } from '../types.js';

export const foldersRouter: Router = Router({});

const tempId = 'user_3976iOKNm1L8mCclYZ1knny7k5E';

/**
 * @openapi
 * /folders:
 *   get:
 *     tags: [Folders]
 *     summary: Получить список папок пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список папок
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListResponseFolder'
 *       401:
 *         description: Unauthorized
 */

foldersRouter.get('', async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return unauthorizedException(res);
  }

  const folders: ListResponse<Folder> = await folderService.getAll(userId);

  return res.json(folders);
});

/*****************************************/
export const CreateFolderBody = z.object({
  title: z.string().trim().min(1, 'title is required'),
  description: z.string().trim().optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC']).optional().default('PRIVATE'),
});

/**
 * @openapi
 * /folders:
 *   post:
 *     tags: [Folders]
 *     summary: Create folder
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFolderBody'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 */

foldersRouter.post('/', async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return unauthorizedException(res);
  }

  const parsed = CreateFolderBody.safeParse(req.body);

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error);

    return res.status(400).json({
      message: 'Invalid title',
      errors: {
        form: tree.errors,
        title: tree.properties?.title?.errors ?? [],
      },
    });
  }

  const data = parsed.data;

  const newFolder = await folderService.create({ ...data, userId });

  return res.status(201).json(newFolder);
});
