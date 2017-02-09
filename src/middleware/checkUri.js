import {notFoundController} from '../controllers/CommonController';

export default function (req, res, next) {
  try {
    decodeURIComponent(req.path);
  } catch (err) {
    return notFoundController(req, res);
  }

  next();
}
