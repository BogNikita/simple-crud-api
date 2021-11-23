const ValidationError = require('./customError');

const validField = (obj) => {
  const requiredFieldsAndType = {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
    hobbies: {
      type: 'string',
    },
  };
  for (const key in requiredFieldsAndType) {
    if (obj.hasOwnProperty(key)) {
      const { type } = requiredFieldsAndType[key];
      if (key === 'hobbies') {
        if (typeof obj[key] !== type) {
          if (Array.isArray(obj[key])) {
            if (obj[key].some((item) => typeof item !== type)) {
              throw new ValidationError(`invalid type for ${key}`, 400);
            }
          } else {
            throw new ValidationError(`invalid type for ${key}`, 400);
          }
        }
      }

      if (typeof obj[key] !== type && key !== 'hobbies') {
        throw new ValidationError(`invalid type for ${key}`, 400);
      }
    } else {
      throw new ValidationError(`${key} is required`, 400);
    }
  }
  return true;
};

module.exports = validField;
