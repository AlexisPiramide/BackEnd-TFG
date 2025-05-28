const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Correos - Node.js',
    description: 'Documentación de la API Correos',
  },
  host: 'localhost:3000'
};

const outputFile = './src/swagger-output.json';
const routes = ['./src/app.ts'];

swaggerAutogen(outputFile, routes, doc);