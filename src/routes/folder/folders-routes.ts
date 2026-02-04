import { getAuth } from '@clerk/express';
import { type Request, type Response, Router } from 'express';
import { z } from 'zod';

import { unauthorizedException } from '../../exceptions/exceptions.js';
import { Folder, Prisma } from '../../generated/prisma/client.js';
import { folderService } from '../../services/folder/folder.service.js';
import { ListResponse } from '../../types.js';

import {
  createFolderBodySchema,
  folderIdParamsSchema,
  updateFolderBodySchema,
} from './schemas.js';

export const foldersRouter: Router = Router({});

const tempId = 'user_3976iOKNm1L8mCclYZ1knny7k5E';
/****************************************/
/* Get All Folders */
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

/***************************************/
/* Get Current Folder */

/**
 * @openapi
 * /folders/{folderId}:
 *   get:
 *     tags:
 *       - Folders
 *     summary: Get current folder
 *     description: Returns a folder by id for the authorized user.
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Folder id
 *     responses:
 *       200:
 *         description: Folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorNotFound'
 *             examples:
 *               notFound:
 *                 value:
 *                   error: Folder not found
 */

const getFolderSchema = z.string();

foldersRouter.get('/:folderId', async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return unauthorizedException(res);
  }

  const parsedParam = getFolderSchema.safeParse(req.params.folderId);

  if (!parsedParam.success) {
    return res.status(404).json({ error: 'Folder not found' });
  }

  const folderId = parsedParam.data;
  const folder = await folderService.getCurrent(folderId, userId);

  return res.json(folder);
});

/*****************************************/
/* Create Folder */
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */

foldersRouter.post('/', async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return unauthorizedException(res);
  }

  const parsed = createFolderBodySchema.safeParse(req.body);

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

/*************************************/
/* Update Folder */
foldersRouter.put('/:folderId', async (req: Request, res: Response) => {
  const paramsResult = folderIdParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ message: 'Invalid params' });
  }

  const bodyResult = updateFolderBodySchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ message: 'Invalid body' });
  }

  const userId = (req as any).user?.id as string;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { folderId } = paramsResult.data;
  const updatePayload = bodyResult.data;

  if (Object.keys(updatePayload).length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  const updatedFolder = await folderService.edit(folderId, updatePayload, userId);
  return res.json(updatedFolder);
});

/************************************/
/* Delete Folder */

/**
 * @openapi
 * /folders/{folderId}:
 *   delete:
 *     tags:
 *       - Folders
 *     summary: Delete folder
 *     description: Deletes a folder by id and returns the deleted folder.
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Folder id
 *     responses:
 *       200:
 *         description: Deleted folder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       400:
 *         description: Invalid params (folderId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidFolderId:
 *                 value:
 *                   message: Invalid params (folderId)
 *       404:
 *         description: Folder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: Folder not found
 */

const deleteFolderParams = z.string();

foldersRouter.delete('/:folderId', async (req: Request, res: Response) => {
  const folderIdParam = req.params.folderId;
  const safeParams = deleteFolderParams.safeParse(folderIdParam);

  if (!safeParams.success) {
    return res.status(400).json({ message: 'Invalid params (folderId)' });
  }

  try {
    const folderId = safeParams.data;
    const deletedFolder = await folderService.delete(folderId);
    return res.json(deletedFolder);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ message: 'Folder not found' });
    }
    throw e;
  }
});
