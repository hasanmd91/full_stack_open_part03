export const unknowsEndPoint = (req, res) => {
  res.status(404).send({ error: 'unknown end point' });
};

export const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message }).end();
  } else if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    'body' in error
  ) {
    return res
      .status(400)
      .json({ error: 'content missing or syntax error' })
      .end();
  }

  next(error);
};
