import { Visibility } from '../../generated/prisma/enums.js';
import { getPaginatedFields } from '../../helpers/getPaginatedFields.js';
import { CreateStudySetInput } from '../../routes/modules/schemas.js';
import { prisma } from '../db/prisma.js';

export const DEFAULT_MODULED_LIMIT = 100;

export const moduleService = {
  // Метод создания Набора (StudySet) с вложенными Карточками
  create: async (data: CreateStudySetInput, userId: string) => {
    return prisma.studySet.create({
      data: {
        ownerId: userId,
        title: data.title,
        description: data.description,
        visibility: data.visibility as Visibility,
        termLang: data.termLang,
        definitionLang: data.definitionLang,

        // Вложенное создание карточек
        cards: {
          create: data.cards.map((card, index) => ({
            term: card.term,
            definition: card.definition,
            // Если sortOrder не пришел, используем индекс массива
            sortOrder: card.sortOrder ?? index,
          })),
        },
      },
      // Возвращаем созданный набор вместе с карточками
      include: {
        cards: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  },

  getModules: async (userId: string, page = 1, limit = DEFAULT_MODULED_LIMIT) => {
    const { safeLimit, safePage, skip } = getPaginatedFields({ page, limit });

    const [items, total] = await prisma.$transaction([
      prisma.studySet.findMany({
        where: { ownerId: userId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take: safeLimit,
        include: {
          _count: {
            select: { cards: true },
          },
        },
      }),
      prisma.studySet.count({
        where: { ownerId: userId },
      }),
    ]);

    const modules = items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      visibility: item.visibility,
      termLang: item.termLang,
      ownerId: item.ownerId,
      cardsCount: item._count.cards,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
      definitionLang: item.definitionLang,
    }));
    return { total, limit: safeLimit, page: safePage, items: modules };
  },
};
