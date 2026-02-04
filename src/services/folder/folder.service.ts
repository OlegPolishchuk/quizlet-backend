import { Visibility } from '../../generated/prisma/enums.js';
import { getPaginatedFields } from '../../helpers/getPaginatedFields.js';
import { omitUndefined } from '../../helpers/omitUndefined.js';
import {
  UpdateFolderBodySchema,
  updateFolderBodySchema,
} from '../../routes/folder/schemas.js';
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

  edit: async (folderId: string, payload: UpdateFolderBodySchema, userId: string) => {
    const data = omitUndefined(payload);

    const result = await prisma.folder.updateMany({
      where: { id: folderId, ownerId: userId },
      data,
    });

    if (result.count === 0) throw new Error('Not found or forbidden');

    return prisma.folder.findUnique({ where: { id: folderId } });
  },

  delete: (folderId: string) => {
    return prisma.folder.delete({
      where: { id: folderId },
    });
  },
};
