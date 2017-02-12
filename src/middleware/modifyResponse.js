export default function (req, res, next) {

  const response = res.json;
  res.json = function(body) {
    this.status(body
      && body.success !== undefined
      && body.success !== false
        ? this.statusCode || 200
        : (body && body.error && body.error.status || 400)
    );

    return response.call(this, body);
  };

  next();
}
