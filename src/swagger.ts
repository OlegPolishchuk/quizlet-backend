import path from 'node:path';

import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        clerkSession: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk session JWT in Authorization: Bearer <token>',
        },
      },
    },
  },
  apis: [
    path.join(process.cwd(), 'src/routes/**/*.ts'),
    path.join(process.cwd(), 'src/docs/**/*.ts'),
    path.join(process.cwd(), 'dist/routes/**/*.js'),
    path.join(process.cwd(), 'dist/docs/**/*.js'),
  ],
});
