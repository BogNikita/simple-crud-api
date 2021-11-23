require('dotenv').config();
const http = require('http');
const uuid = require('uuid');
const validationField = require('./validationField');

const db = [];

class ValidationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }
}

const validId = (url) => {
  const id = url.pop();
  if (!uuid.validate(id)) {
    throw new ValidationError('id not valid', 400);
  }
  const index = db.findIndex((el) => el.id === id);
  if (index === -1) {
    throw new ValidationError('not found', 404);
  }
  return index;
};

http
  .createServer((request, response) => {
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    if (request.url.match(/^\/person\/?.*$/)) {
      switch (request.method) {
        case 'GET':
          try {
            const url = request.url.split('/');
            if (url.length > 2) {
              const index = validId(url, response);
              response.statusCode = 200;
              response.end(JSON.stringify(db[index]));
            } else {
              response.statusCode = 200;
              response.end(JSON.stringify(db));
            }
          } catch (error) {
            response.statusCode = error.statusCode || 500;
            response.end(error.message || 'smt went wrong');
          }
          break;
        case 'POST': {
          let data = '';
          request.on('data', (chunk) => {
            data += chunk;
          });
          request.on('end', () => {
            const requestData = JSON.parse(data);
            validationField(requestData)
            const newUser = {
              id: uuid.v1(),
              name: requestData.name,
              age: requestData.age,
              hobbies: requestData.hobbies,
            };
            db.push(newUser);
            response.statusCode = 201;
            response.end(JSON.stringify(newUser));
          });
          break;
        }
        case 'PUT': {
          try {
            const url = request.url.split('/');
            const index = validId(url, response);
            const requestData = JSON.parse(data);
            db[index] = {
              ...db[index],
              name: requestData.name,
              age: requestData.age,
              hobbies: requestData.hobbies || 'test',
            };
            response.statusCode = 200;
            response.end(JSON.stringify(db[index]));
          } catch (error) {
            response.statusCode = error.statusCode || 500;
            response.end(error.message || 'smt went wrong');
          }
          break;
        }
        case 'DELETE':
          try {
            let data = '';
            request.on('data', (chunk) => {
              data += chunk;
            });
            request.on('end', () => {
              const url = request.url.split('/');
              const index = validId(url, response);
              db.splice(index, 1);
              response.statusCode = 204;
              response.end();
            });
          } catch (error) {
            response.statusCode = error.statusCode || 500;
            response.end(error.message || 'smt went wrong');
          }
          break;
        default:
          response.statusCode = 500;
          response.end('smt went wrong');
      }
    } else {
      response.statusCode = 404;
      response.end('page not found');
    }
  })
  .listen(process.env.PORT, () => console.log(`Server listen port ${process.env.PORT}`));
