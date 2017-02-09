import {parse} from 'url'
import * as redirectHelper from '../lib/redirect';

export default function (req, res, next) {
  const method = req.method.toLowerCase();

  if (!(method === 'get' || method === 'head')) {
    return next();
  }

  const url = parse(req.url),
    pathname = url.pathname,
    search   = url.search || '',
    hasSlash = pathname.charAt(pathname.length - 1) === '/';

  // Если нет слэша и запрашивается не файл (типа robots.txt), то сделаем редирект
  if (!hasSlash && pathname.indexOf('.') === -1) {
    return redirectHelper.noCache(res, pathname + '/' + search);
  }

  return next();
}
