import express from 'express';
import morgan from 'morgan';
import Contact from './models/contact.js';
import { configDotenv } from 'dotenv';

configDotenv();

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};

const isString = (str) => {
  if (typeof str !== 'string') {
    throw new Error(`typeof ${str} is not valid`);
  }
  return str;
};

const parseName = (name) => {
  if (!name || !isString(name)) {
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

const unknowsEndPoint = (req, res) => {
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

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.use(errorHandler);

app.post('/api/persons', async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ error: 'content is missing' });
  }

  try {
    const name = parseName(body.name);
    const number = parseNumber(body.number);

    const existingContact = await Contact.findOne({ name });
    if (existingContact) {
      existingContact.number = number;
    }
    const newContact = new Contact({
      name,
      number,
    });

    newContact
      .save()
      .then((contact) => res.json(contact))
      .catch((err) => {
        res.status(404).json({ error: err.message }).end();
      });
  } catch (err) {
    res.status(500).json({ error: err.message }).end();
  }
});

app.use(unknowsEndPoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(` server running in the PORT ${PORT}`);
});
