const express = require('express');
const phoneBookData = require('./src/Data/index.js');
const {
  parseName,
  parseNumber,
  generateRandomId,
} = require('./src/Utils/index.js');
const morgan = require('morgan');

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

app.get('/api/persons', (req, res) => {
  res.json(phoneBookData);
});

app.get('/info', (_req, res) => {
  res.send(
    `<p>The phone book has info for ${
      phoneBookData.length
    } people </p> <br/> ${new Date()}`
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const data = phoneBookData.find((d) => d.id === id);

  if (data) {
    res.json(data);
  } else {
    res
      .status(404)
      .send({ error: `${id} is missing or not exist in the phonebook` });
  }
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

const port = 3001;
app.listen(port, () => {
  console.log(` server running in the port ${port}`);
});
