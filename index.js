import express from 'express';
import morgan from 'morgan';
import Contact from './models/contact.js';
import { configDotenv } from 'dotenv';

configDotenv();

const phoneBookData = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

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

const parseName = (name) => {
  if (!name || !isString(name) || !checkUnique(name)) {
    throw new Error('name is missing');
  }
  return name;
};

const parseNumber = (number) => {
  if (!number || !isString(number)) {
    throw new Error('number is missing');
  }
  return number;
};

function generateRandomId(length) {
  let min = Math.pow(10, length);
  let max = Math.pow(10, length + 1) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const unknowsEndPoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown end point' });
};

morgan.token('body', (req, res) => JSON.stringify(req.body));

const app = express();
app.use(express.json());
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);
app.use(express.static('build'));

app.get('/info', (_req, res) => {
  res.send(
    `<p>The phone book has info for ${
      phoneBookData.length
    } people </p> <br/> ${new Date()}`
  );
});

app.get('/api/persons', (req, res) => {
  Contact.find({})
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      res.status(500).json(error.message).end();
    });
});

app.get('/api/persons/:id', (req, res) => {
  Contact.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = phoneBookData.filter((d) => d.id !== id);
  if (data) {
    res.json(data);
  } else {
    res
      .status(404)
      .send({ error: `${id} is missing or not exist in the phonebook` });
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({ error: 'content is missing ' });
  }

  try {
    const data = {
      id: generateRandomId(phoneBookData.length),
      name: parseName(body.name),
      number: parseNumber(body.number),
    };
    phoneBookData.push(data);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: `${err.message}` });
  }
});

app.use(unknowsEndPoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(` server running in the PORT ${PORT}`);
});
