const uuid = require('uuid');
const ValidationError = require('./customError');

const validId = (url, db) => {
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

module.exports = validId;
