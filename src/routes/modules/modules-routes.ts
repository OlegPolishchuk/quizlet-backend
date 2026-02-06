import { getAuth } from '@clerk/express';
import express, { Response, Request, Router } from 'express';
import { z } from 'zod';

import { StudySet } from '../../generated/prisma/client.js';
import { moduleService } from '../../services/module/module.service.js';
import { ListResponse } from '../../types.js';

import { CreateStudySetSchema } from './schemas.js';
import { ModuleListItem } from './types.js';

export const moduleRouter: Router = express.Router({});

/****************************/
/* Create Module */
/**
 * @openapi
 * /modules:
 *   post:
 *     tags:
 *       - Modules
 *     summary: Создать учебный модуль
 *     description: Создает новый модуль (сет карточек) с терминами.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateModuleBody'
 *     responses:
 *       201:
 *         description: Модуль успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       400:
 *         description: Ошибка валидации данных (например, менее 2 терминов или пустое название)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Пользователь не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

moduleRouter.post('', async (req: Request, res: Response) => {
  const parsedData = CreateStudySetSchema.safeParse(req.body);

  if (!parsedData.success) {
    const tree = z.treeifyError(parsedData.error);

    return res.status(400).json({
      message: 'Invalid data',
      errors: {
        form: tree.errors,
        title: tree.properties?.title?.errors ?? [],
      },
    });
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const newModule = await moduleService.create(parsedData.data, userId);

    return res.status(201).json(newModule);
  } catch (error) {
    console.error('Failed to create module:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**************************************/
/* Get all modules */
/**************************************/
/* Get all modules */
/**
 * @openapi
 * /modules:
 *   get:
 *     tags:
 *       - Modules
 *     summary: Получить список модулей
 *     description: Возвращает список модулей текущего пользователя (с пагинацией и счетчиком карточек).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список модулей
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListResponseModule'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
moduleRouter.get('', async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const modules: ListResponse<ModuleListItem> = await moduleService.getModules(userId);

  return res.status(200).json(modules);
});
