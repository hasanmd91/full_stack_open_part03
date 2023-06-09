export const unknowsEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknown end point' });
};

export const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  res.status(500).json({ error: error.message }).end();
  next(error);
};
