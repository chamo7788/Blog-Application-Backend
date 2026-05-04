import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Debug',
      version: '1.0.0',
    },
  },
  apis: [
    path.join(__dirname, '../src/routes/*.ts'),
    path.join(__dirname, '../src/controllers/*.ts')
  ],
};

const spec = swaggerJsdoc(options);
fs.writeFileSync(path.join(__dirname, 'spec.json'), JSON.stringify(spec, null, 2));
console.log('Generated spec.json');
