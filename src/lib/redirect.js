export function noCache(res, url, status = 301) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
  res.setHeader('Expires', 'Thu, 19 May 1988 08:45:00 GMT');
  return res.redirect(status, url);
}
