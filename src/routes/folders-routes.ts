import { type Request, type Response, Router } from 'express';

import { Folder } from '../generated/prisma/client.js';
import { folderService } from '../services/folder/folder.service.js';
import { ListResponse } from '../types.js';

export const foldersRouter: Router = Router({});

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
  console.log('Folders REQUEST');
  // const { userId } = getAuth(req);
  //
  // if (!userId) {
  //   return unauthorizedException(res);
  // }

  const tempId = 'user_3976iOKNm1L8mCclYZ1knny7k5E';

  const folders: ListResponse<Folder> = await folderService.getAll(tempId);

  return res.json(folders);
});
