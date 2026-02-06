import { type Request, type Response, Router } from 'express';
import { z } from 'zod';

import { termService } from '../../services/term/term.service.js';

export const termRouter: Router = Router({});

const termSchema = z.string();

/**
 * @openapi
 * /terms/{word}:
 *   get:
 *     tags:
 *       - Terms
 *     summary: Получить определение слова
 *     description: Возвращает фонетику, аудио и значения слова из словаря.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: word
 *         required: true
 *         schema:
 *           type: string
 *         description: Английское слово для поиска
 *         example: "hello"
 *     responses:
 *       200:
 *         description: Информация о слове
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Word'
 *       404:
 *         description: Слово не найдено или ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorNotFound'
 *             examples:
 *               notFound:
 *                 value:
 *                   error: "Word was not found"
 */

termRouter.get('/:word', async (req: Request, res: Response) => {
  const parsedParams = termSchema.safeParse(req.params.word);
  if (!parsedParams.success) {
    return res.status(404).json({ error: 'Word was not found' });
  }

  const word = parsedParams.data;
  const wordRes = await termService.findWord(word);

  return res.status(200).json(wordRes.data);
});
