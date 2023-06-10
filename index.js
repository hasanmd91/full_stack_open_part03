import express from 'express';
import morgan from 'morgan';
import Contact from './src/models/contact.js';
import { configDotenv } from 'dotenv';
import { unknowsEndPoint, errorHandler } from './src/middleware/middleware.js';

configDotenv();

const app = express();
app.use(express.json());
app.use(express.static('build'));
morgan.token('body', (req, _res) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);

app.get('/info', (_req, res) => {
  res.send(
    `<p>The phone book has info for ${
      phoneBookData.length
    } people </p> <br/> ${new Date()}`
  );
});

app.get('/api/persons', (_req, res) => {
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
    .then(() => {
      res.json('contact has been deleted').end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (name === undefined || number === undefined) {
    return req.status(400).json({ error: 'content missing' });
  }

  Contact.findOne({ name })
    .then((existingContact) => {
      if (existingContact) {
        return res
          .status(409)
          .json({
            error: 'Contact already exists in the database! Update instead',
          })
          .end();
      } else {
        const newContact = new Contact({
          name,
          number,
        });

        return newContact
          .save()
          .then((contact) => res.json(contact))
          .catch((error) => {
            res.status(500).json({ error: error.message }).end();
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message }).end();
    });
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  if (name === undefined || number === undefined) {
    return req.status(400).json({ error: 'content missing' });
  }

  const updatedContact = { name, number };

  Contact.findByIdAndUpdate(req.params.id, updatedContact, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.status(200).json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.use(errorHandler);
app.use(unknowsEndPoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running in the PORT ${PORT}`);
});
