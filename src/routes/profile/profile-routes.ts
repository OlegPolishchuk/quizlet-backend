import { getAuth } from '@clerk/express';
import { type Request, type Response, Router } from 'express';

import { prisma } from '../../services/db/prisma.js';

export const profileRouter: Router = Router({});

/**
 * @openapi
 * /profile/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the current authenticated user from the local database (Prisma) by Clerk userId.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileMeResponse'
 *       401:
 *         description: Not authenticated
 */

profileRouter.get('/me', async (req: Request, res: Response) => {
  console.log('ME REQUEST');
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return res.json(user);
});
