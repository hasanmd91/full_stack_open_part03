import { phoneBookData } from '../Data/index.js';

const isString = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`typeof ${str} is not valid`);
  }
  return str;
};

const checkUnique = (name) => {
  const matchedData = phoneBookData.find((data) => data.name === name);
  console.log(name);
  if (matchedData) {
    throw new Error(`provided name ${name} must be unique`);
  }
  return name;
};

export const parseName = (name) => {
  if (!name || !isString(name) || !checkUnique(name)) {
    throw new Error('name is missing');
  }
  return name;
};

export const parseNumber = (number) => {
  if (!number || !isString(number)) {
    throw new Error('number is missing');
  }
  return number;
};

export function generateRandomId(length) {
  let min = Math.pow(10, length);
  let max = Math.pow(10, length + 1) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
