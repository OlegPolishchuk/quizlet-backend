import { z } from 'zod';

export const VISIBILITY = ['PRIVATE', 'PUBLIC'];

// Enum для visibility (должен совпадать с Prisma enum)
export const VisibilitySchema = z.enum(VISIBILITY);

// Схема для одной карточки при создании
export const CreateStudyCardSchema = z.object({
  term: z
    .string()
    .min(1, 'Термин не может быть пустым')
    .max(500, 'Термин слишком длинный'),
  definition: z
    .string()
    .min(1, 'Определение не может быть пустым')
    .max(2000, 'Определение слишком длинное'),
  sortOrder: z.number().int().nonnegative().optional(), // опционально, можно проставить на бэке
});

// Схема для создания набора с карточками
export const CreateStudySetSchema = z.object({
  title: z
    .string()
    .min(1, 'Название набора обязательно')
    .max(200, 'Название слишком длинное'),
  description: z.string().max(1000, 'Описание слишком длинное').nullable(),
  visibility: VisibilitySchema.default('PRIVATE'),
  termLang: z
    .string()
    .length(2, 'Код языка должен быть из 2 символов (ISO 639-1)')
    .nullable(),
  definitionLang: z
    .string()
    .length(2, 'Код языка должен быть из 2 символов (ISO 639-1)')
    .nullable(),

  // Карточки: минимум 2, максимум 500 (как в Quizlet)
  cards: z
    .array(CreateStudyCardSchema)
    .min(2, 'Добавьте минимум 2 карточки')
    .max(500, 'Максимум 500 карточек в наборе')
    .refine(
      cards => {
        // Проверка: нет дубликатов по term (опционально)
        const terms = cards.map(c => c.term.toLowerCase().trim());
        return terms.length === new Set(terms).size;
      },
      { message: 'Найдены дублирующиеся термины' },
    ),
});

// Схема для обновления набора (все поля опциональны, кроме карточек)
export const UpdateStudySetSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  visibility: VisibilitySchema.optional(),
  termLang: z.string().length(2).optional().nullable(),
  definitionLang: z.string().length(2).optional().nullable(),
});

// Схема для обновления карточки
export const UpdateStudyCardSchema = z.object({
  id: z.string().cuid(), // id существующей карточки
  term: z.string().min(1).max(500).optional(),
  definition: z.string().min(1).max(2000).optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

// Схема для batch-обновления карточек в наборе
export const UpdateStudySetCardsSchema = z.object({
  setId: z.string().cuid(),
  cards: z.array(
    z.discriminatedUnion('action', [
      // Создать новую
      z.object({
        action: z.literal('create'),
        term: z.string().min(1).max(500),
        definition: z.string().min(1).max(2000),
        sortOrder: z.number().int().nonnegative().optional(),
      }),
      // Обновить существующую
      z.object({
        action: z.literal('update'),
        id: z.string().cuid(),
        term: z.string().min(1).max(500).optional(),
        definition: z.string().min(1).max(2000).optional(),
        sortOrder: z.number().int().nonnegative().optional(),
      }),
      // Удалить
      z.object({
        action: z.literal('delete'),
        id: z.string().cuid(),
      }),
    ]),
  ),
});

// Типы для использования в TypeScript
export type CreateStudySetInput = z.infer<typeof CreateStudySetSchema>;
export type UpdateStudySetInput = z.infer<typeof UpdateStudySetSchema>;
export type CreateStudyCardInput = z.infer<typeof CreateStudyCardSchema>;
export type UpdateStudyCardInput = z.infer<typeof UpdateStudyCardSchema>;
export type UpdateStudySetCardsInput = z.infer<typeof UpdateStudySetCardsSchema>;
