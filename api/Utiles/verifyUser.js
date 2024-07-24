import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "You are not authorized to access this resource"));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(401, "You are not authorized to access this resource"));
      }

      req.user = user;
      next();
    });
  } catch (err) {
    return next(errorHandler(401, "You are not authorized to access this resource"));
  }
};
