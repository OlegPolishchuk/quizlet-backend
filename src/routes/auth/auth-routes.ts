import { getAuth } from '@clerk/express';
import { type Request, type Response, Router } from 'express';

import { prisma } from '../../services/db/prisma.js';

export const authRouter: Router = Router({});

/**
 * @openapi
 * /auth/sync:
 *   get:
 *     summary: Sync Clerk user into local DB
 *     description: Fetches the current Clerk user and upserts it into Prisma User table.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User synced
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                       nullable: true
 *                     firstName:
 *                       type: string
 *                       nullable: true
 *                     lastName:
 *                       type: string
 *                       nullable: true
 *                     imageUrl:
 *                       type: string
 *                       nullable: true
 *                     emailVerified:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Sync failed
 */

authRouter.get('/sync', async (req: Request, res: Response) => {
  console.log('AUTH GET');

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Синхронизируем пользователя из Clerk в нашу БД
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(r => r.json());

    const userData = {
      id: userId,
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name,
      lastName: clerkUser.last_name,
      imageUrl: clerkUser.profile_image_url,
      emailVerified:
        clerkUser.email_addresses[0]?.verification?.status === 'verified'
          ? new Date()
          : null,
    };

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: userData,
      create: {
        ...userData,
        profile: {
          create: {
            locale: 'ru',
            timezone: 'Europe/Minsk',
            fullName:
              [clerkUser.first_name, clerkUser.last_name].filter(Boolean).join(' ') ||
              null,
            avatarUrl: clerkUser.profile_image_url ?? null,
          },
        },
      },
      include: { profile: true },
    });

    res.json(user);
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});
