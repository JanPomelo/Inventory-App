import { Request, Response, NextFunction } from 'express';
const accessRoute = (req: Request, res: Response, next: NextFunction) => {
  res.locals.currentRoute = req.path;
  next();
};

export default accessRoute;
