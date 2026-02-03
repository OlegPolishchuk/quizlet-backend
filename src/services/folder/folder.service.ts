import { Visibility } from '../../generated/prisma/enums.js';
import { getPaginatedFields } from '../../helpers/getPaginatedFields.js';
import { prisma } from '../db/prisma.js';

const DEFAULT_FOLDERS_LIMIT = 20;

export const folderService = {
  getAll: async (userId: string, page = 1, limit = DEFAULT_FOLDERS_LIMIT) => {
    const { safeLimit, safePage, skip } = getPaginatedFields({ page, limit });

    const [items, total] = await prisma.$transaction([
      prisma.folder.findMany({
        where: { ownerId: userId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take: safeLimit,
      }),
      prisma.folder.count({
        where: { ownerId: userId },
      }),
    ]);

    return { total, limit: safeLimit, page: safePage, items };
  },

  create: async ({
    userId,
    visibility,
    title,
    description,
  }: {
    title: string;
    userId: string;
    description?: string | undefined;
    visibility: Visibility;
  }) => {
    return prisma.folder.create({
      data: {
        title,
        description: description ?? null,
        visibility,
        ownerId: userId,
      },
    });
  },
};
