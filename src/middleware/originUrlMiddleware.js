export default (req, res, next) => {
  req.origin = `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers.host}`;
  return next();
}
