/**
 * @openapi
 * components:
 *   schemas:
 *     # ---------------- Errors ----------------
 *     ApiError:
 *       type: object
 *       additionalProperties: false
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: "Unauthorized"
 *
 *     ValidationError:
 *       type: object
 *       additionalProperties: false
 *       required: [message, errors]
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid input"
 *         errors:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             form: ["Invalid input"]
 *             field: ["Required"]
 *
 *     ValidationErrorResponse:
 *       $ref: '#/components/schemas/ValidationError'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Something went wrong"
 *
 *     ErrorNotFound:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Resource not found"
 *
 *     # ---------------- Common ----------------
 *     Id:
 *       type: string
 *       example: "clx9o0c2f0000v8kz1p2a3b4c"
 *
 *     DateTime:
 *       type: string
 *       format: date-time
 *       example: "2026-02-04T07:41:00.000Z"
 *
 *     Role:
 *       type: string
 *       enum: [USER, ADMIN]
 *
 *     Visibility:
 *       type: string
 *       enum: [PRIVATE, PUBLIC]
 *
 *     # ---------------- Users / Profile ----------------
 *     User:
 *       type: object
 *       additionalProperties: false
 *       required: [id, email, role, createdAt, updatedAt]
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         emailVerified:
 *           $ref: '#/components/schemas/DateTime'
 *           nullable: true
 *         username:
 *           type: string
 *           nullable: true
 *           example: "cool_user"
 *         firstName:
 *           type: string
 *           nullable: true
 *           example: "Ivan"
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: "Ivanov"
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/avatar.png"
 *         role:
 *           $ref: '#/components/schemas/Role'
 *         createdAt:
 *           $ref: '#/components/schemas/DateTime'
 *         updatedAt:
 *           $ref: '#/components/schemas/DateTime'
 *
 *     Profile:
 *       type: object
 *       additionalProperties: false
 *       required: [id, userId, createdAt, updatedAt]
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         userId:
 *           $ref: '#/components/schemas/Id'
 *         fullName:
 *           type: string
 *           nullable: true
 *           example: "Ivan Ivanov"
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/avatar.png"
 *         bio:
 *           type: string
 *           nullable: true
 *           example: "I love biology"
 *         locale:
 *           type: string
 *           nullable: true
 *           example: "ru"
 *         timezone:
 *           type: string
 *           nullable: true
 *           example: "Europe/Minsk"
 *         createdAt:
 *           $ref: '#/components/schemas/DateTime'
 *         updatedAt:
 *           $ref: '#/components/schemas/DateTime'
 *
 *     ProfileMeResponse:
 *       $ref: '#/components/schemas/User'
 *
 *     # ---------------- Folders ----------------
 *     Folder:
 *       type: object
 *       additionalProperties: false
 *       required: [id, ownerId, title, visibility, createdAt, updatedAt]
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         ownerId:
 *           $ref: '#/components/schemas/Id'
 *         title:
 *           type: string
 *           example: "Biology"
 *         description:
 *           type: string
 *           nullable: true
 *         visibility:
 *           $ref: '#/components/schemas/Visibility'
 *         createdAt:
 *           $ref: '#/components/schemas/DateTime'
 *         updatedAt:
 *           $ref: '#/components/schemas/DateTime'
 *
 *     CreateFolderBody:
 *       type: object
 *       additionalProperties: false
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           example: "Biology"
 *         description:
 *           type: string
 *           nullable: true
 *         visibility:
 *           $ref: '#/components/schemas/Visibility'
 *
 *     UpdateFolderBody:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *         description:
 *           type: string
 *           nullable: true
 *         visibility:
 *           $ref: '#/components/schemas/Visibility'
 *       example:
 *         title: "New Title"
 *         description: "Updated description"
 *         visibility: "PRIVATE"
 *
 *     # ---------------- Pagination ----------------
 *     PaginationMeta:
 *       type: object
 *       additionalProperties: false
 *       required: [total, limit, page]
 *       properties:
 *         total:
 *           type: integer
 *           example: 42
 *         limit:
 *           type: integer
 *           example: 20
 *         page:
 *           type: integer
 *           example: 1
 *
 *     ListResponseFolder:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationMeta'
 *         - type: object
 *           additionalProperties: false
 *           required: [items]
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Folder'
 *
 *     # ---------------- Terms / Dictionary ----------------
 *     Word:
 *       type: object
 *       properties:
 *         word:
 *           type: string
 *           example: "hello"
 *         phonetics:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "/həˈləʊ/"
 *               audio:
 *                 type: string
 *                 example: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3"
 *         meanings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               partOfSpeech:
 *                 type: string
 *                 example: "noun"
 *               definitions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     definition:
 *                       type: string
 *                       example: "A greeting (salutation) said when meeting someone."
 *                     example:
 *                       type: string
 *                       nullable: true
 *                       example: "Hello, everyone."
 *                     synonyms:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["greeting", "welcome"]
 *                     antonyms:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["goodbye"]
 *
 *     # ---------------- Modules (Study Sets) ----------------
 *
 *     ModuleCard:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         term:
 *           type: string
 *           example: "Apple"
 *         definition:
 *           type: string
 *           example: "A fruit"
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         sortOrder:
 *           type: integer
 *           example: 0
 *
 *     Module:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         ownerId:
 *           $ref: '#/components/schemas/Id'
 *         title:
 *           type: string
 *           example: "English Basics"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Basic vocabulary"
 *         visibility:
 *           $ref: '#/components/schemas/Visibility'
 *         termLang:
 *           type: string
 *           example: "en"
 *         definitionLang:
 *           type: string
 *           example: "ru"
 *         cards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ModuleCard'
 *         createdAt:
 *           $ref: '#/components/schemas/DateTime'
 *         updatedAt:
 *           $ref: '#/components/schemas/DateTime'
 *
 *     ModuleListItem:
 *       type: object
 *       properties:
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         ownerId:
 *           $ref: '#/components/schemas/Id'
 *         title:
 *           type: string
 *           example: "English Basics"
 *         description:
 *           type: string
 *           nullable: true
 *         visibility:
 *           $ref: '#/components/schemas/Visibility'
 *         termLang:
 *           type: string
 *           example: "en"
 *         definitionLang:
 *           type: string
 *           example: "ru"
 *         cardsCount:
 *           type: integer
 *           description: "Количество карточек в модуле"
 *           example: 15
 *         createdAt:
 *           $ref: '#/components/schemas/DateTime'
 *         updatedAt:
 *           $ref: '#/components/schemas/DateTime'
 *
 *     CreateModuleBody:
 *       type: object
 *       required: [title, cards]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           example: "English Basics"
 *         description:
 *           type: string
 *           nullable: true
 *         visibility:
 *           $ref: '#/components/schemas/Visibility'
 *         termLang:
 *           type: string
 *           default: "en"
 *         definitionLang:
 *           type: string
 *           default: "ru"
 *         cards:
 *           type: array
 *           minItems: 2
 *           items:
 *             type: object
 *             required: [term, definition]
 *             properties:
 *               term:
 *                 type: string
 *                 example: "Cat"
 *               definition:
 *                 type: string
 *                 example: "Кошка"
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *
 *     ListResponseModule:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginationMeta'
 *         - type: object
 *           additionalProperties: false
 *           required: [items]
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModuleListItem'
 */
export {};
