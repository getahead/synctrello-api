export default function (req, res, next) {
  const response = res.json;
  res.json = function(body) {
    if (body && this.statusCode < 500) {
      this.status(body.success !== undefined && body.success !== false
          ? this.statusCode || 200
          : (body.error && body.error.status || 400)
      );
    }

    return response.call(this, body);
  };

  next();
}
