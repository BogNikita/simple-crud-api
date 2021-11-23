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
              throw new Error(`invalid type for ${key}`);
            }
          } else {
            throw new Error(`invalid type for ${key}`);
          }
        }
      }

      if (typeof obj[key] !== type && key !== 'hobbies') {
        throw new Error(`invalid type for ${key}`);
      }
    } else {
      throw new Error(`${key} not found`);
    }
  }
  return true;
};

module.exports = validField
