const isString = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`typeof ${str} is not valid`);
  }
};

const parseName = (name) => {
  if (!name || name.length < 0 || isString(name)) {
    throw new Error(' name is missing');
  }
};

const parseNumber = (number) => {
  if (!number || number.length < 0 || isString(number)) {
    throw new Error(' name is missing');
  }
};
