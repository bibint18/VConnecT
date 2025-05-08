"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.log("reaced error handler");
    console.error("Error occured: ", err);
    const statusCode = err.statusCode || 500;
    const errorResponse = Object.assign({ message: err.message || "Internal server Error" }, (process.env.NODE_ENV === 'development' && { stack: err.stack }));
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
