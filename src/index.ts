import { clerkMiddleware, requireAuth } from '@clerk/express';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import 'dotenv/config';
import { authRouter } from './routes/auth/auth-routes.js';
import { foldersRouter } from './routes/folder/folders-routes.js';
import { moduleRouter } from './routes/modules/modules-routes.js';
import { profileRouter } from './routes/profile/profile-routes.js';
import { termRouter } from './routes/term/term-routes.js';
import { swaggerSpec } from './swagger.js';

const app: Application = express();
const PORT = process.env.PORT || 4200;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Глобальный middleware (req.auth для ВСЕХ роутов)
app.use(clerkMiddleware());

app.use('/auth', authRouter);
app.use('/profile', requireAuth(), profileRouter);
app.use('/folder', requireAuth(), foldersRouter);
app.use('/terms', termRouter);
app.use('/modules', requireAuth(), moduleRouter);

app.listen(PORT, () => {
  console.log(`Server running !! at http://localhost:${PORT}`);
});
