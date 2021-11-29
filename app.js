require('dotenv').config();
const http = require('http');
const uuid = require('uuid');
const validId = require('./validationId');
const validationField = require('./validationField');
const ValidationError = require('./customError');

const db = [];

http
  .createServer(async (request, response) => {
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    try {
      if (request.url.match(/^\/person(\/.*)?$/)) {
        const url = request.url.split('/');

        switch (request.method) {
          case 'GET':
            if (url.length > 2) {
              const index = validId(url, db);
              response.statusCode = 200;
              response.end(JSON.stringify(db[index]));
            } else {
              response.statusCode = 200;
              response.end(JSON.stringify(db));
            }
            break;
          case 'POST': {
            if (url.length > 2) {
              throw new ValidationError('Invalid url', 400);
            }
            const buffers = [];

            for await (const chunk of request) {
              buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            const requestData = JSON.parse(data);
            validationField(requestData);
            const newUser = {
              id: uuid.v1(),
              name: requestData.name,
              age: requestData.age,
              hobbies: requestData.hobbies,
            };
            db.push(newUser);
            response.statusCode = 201;
            response.end(JSON.stringify(newUser));
            break;
          }
          case 'PUT': {
            const buffers = [];

            for await (const chunk of request) {
              buffers.push(chunk);
            }

            const data = Buffer.concat(buffers).toString();
            const index = validId(url, db);
            const requestData = JSON.parse(data);
            validationField(requestData);
            db[index] = {
              ...db[index],
              name: requestData.name,
              age: requestData.age,
              hobbies: requestData.hobbies || 'test',
            };
            response.statusCode = 200;
            response.end(JSON.stringify(db[index]));
            break;
          }
          case 'DELETE':
            {
              const index = validId(url, db);
              db.splice(index, 1);
              response.statusCode = 204;
              response.end();
            }
            break;
          default:
            response.statusCode = 500;
            response.end('method not defined');
        }
      } else {
        response.statusCode = 404;
        response.end('page not found');
      }
    } catch (error) {
      console.log(error);
      response.statusCode = error.statusCode || 500;
      response.end(error.message || 'smt went wrong');
    }
  })
  .listen(process.env.PORT, () => console.log(`Server listen port ${process.env.PORT}`));
