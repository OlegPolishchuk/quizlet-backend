import { getAuth } from '@clerk/express';
import { type Request, type Response, Router } from 'express';

import { unauthorizedException } from '../exceptions/exceptions.js';
import { prisma } from '../services/db/prisma.js';
import { folderService } from '../services/folder/folder.service.js';

export const foldersRouter: Router = Router({});

foldersRouter.get('', async (req: Request, res: Response) => {
  console.log('Folders REQUEST');
  // const { userId } = getAuth(req);
  //
  // if (!userId) {
  //   return unauthorizedException(res);
  // }

  const tempId = 'user_3976iOKNm1L8mCclYZ1knny7k5E';

  const folders = await folderService.getAll(tempId);

  return res.json(folders);
});
