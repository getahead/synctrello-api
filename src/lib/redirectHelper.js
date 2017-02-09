export default (res, url, status = 301) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
  res.setHeader('Expires', 'Fri, 24 November 1989 12:30:00 GMT');
  return res.redirect(status, url);
};
