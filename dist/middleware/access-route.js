"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRoute = (req, res, next) => {
    res.locals.currentRoute = req.path;
    next();
};
exports.default = accessRoute;
