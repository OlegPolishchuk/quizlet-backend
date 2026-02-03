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
    './src/routes/*.ts', // если в деве запускаешь ts
    './dist/routes/*.js', // если в проде запускаешь собранный js
    'src/docs/**/*.ts',
  ],
});
