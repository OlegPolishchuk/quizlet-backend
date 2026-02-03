/**
 * @openapi
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       required: [id, ownerId, title, visibility, createdAt, updatedAt]
 *       properties:
 *         id: { type: string }
 *         ownerId: { type: string }
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         visibility: { type: string, example: "PRIVATE" }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     ListResponseFolder:
 *       type: object
 *       required: [total, limit, page, items]
 *       properties:
 *         total: { type: integer, example: 42 }
 *         limit: { type: integer, example: 20 }
 *         page: { type: integer, example: 1 }
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Folder'
 *
 *     Profile:
 *       type: object
 *       required: [id, userId, createdAt, updatedAt]
 *       properties:
 *         id: { type: string }
 *         userId: { type: string }
 *         fullName: { type: string, nullable: true }
 *         avatarUrl: { type: string, nullable: true }
 *         bio: { type: string, nullable: true }
 *         locale: { type: string, nullable: true, example: "ru" }
 *         timezone: { type: string, nullable: true, example: "Europe/Minsk" }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     ClerkUser:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         email: { type: string, nullable: true }
 *         firstName: { type: string, nullable: true }
 *         lastName: { type: string, nullable: true }
 *         imageUrl: { type: string, nullable: true }
 *         emailVerified: { type: string, format: date-time, nullable: true }
 *
 *     ProfileMeResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/ClerkUser'
 *           nullable: true
 */
export {};
