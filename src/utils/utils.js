const isString = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`${str} is not valid name`);
  }
  return str;
};

const isNumber = (number) => {
  if (typeof number !== 'number') {
    throw new Error(`${number} is not valid number`);
  }
  return number;
};

export const parseNumber = (number) => {
  if (!number || !isNumber(number)) {
    throw new Error('number is missing');
  }
  return number;
};

export const parseName = (name) => {
  if (!name || !isString(name)) {
    throw new Error('name is missing');
  }

  return name;
};
