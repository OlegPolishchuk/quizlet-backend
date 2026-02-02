// middlewares/syncUserToDb.ts
import { getAuth, clerkClient } from '@clerk/express';
import { type Request, type Response, type NextFunction } from 'express';

import { prisma } from '../services/db/prisma.js';

export const syncUserToDb = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Берем userId из УЖЕ отработавшего clerkMiddleware
  // (req.auth доступен благодаря clerkMiddleware)
  const { userId } = getAuth(req);

  // Если юзера нет в токене — пусть разбирается requireAuth() или другая защита
  if (!userId) {
    return next();
  }

  try {
    // 2. Ищем в нашей базе
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      // Оптимизация: кладем юзера в req, чтобы потом не искать опять
      (req as any).user = existingUser;
      return next();
    }

    // 3. Если нет — идем в Clerk API за данными
    const clerkUser = await clerkClient.users.getUser(userId);
    // 4. Создаем в нашей базе
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: clerkUser.emailAddresses[0]!.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        // ... остальные поля
      },
    });

    (req as any).user = newUser;
    return next();
  } catch (err) {
    console.error('Failed to sync user', err);
    res.status(500).json({ error: 'Database sync error' });
  }
};
