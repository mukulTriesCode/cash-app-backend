const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cash App API Documentation',
      version: '1.0.0',
      description: 'API documentation for Cash App Backend',
    },
    servers: [
      {
        url: 'https://cash-app-backend.vercel.app',
        description: 'Live server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};