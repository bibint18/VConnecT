
import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { AppError } from "../utils/AppError.js";

export function validateRequest<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let instance: T;
      if (req.method === "GET") {
        instance = new dtoClass();
        Object.assign(instance, req.query);
      } else {
        if (Object.keys(req.body).length === 0 && req.method !== "GET") {
          throw new AppError("Request body is required", 400);
        }
        instance = new dtoClass();
        Object.assign(instance, req.body);
      }

      const errors: ValidationError[] = await validate(instance, {
        skipMissingProperties: false,
        forbidUnknownValues: true,
      });

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => {
            if (error.constraints) {
              return Object.values(error.constraints).join(", ");
            }
            return `Invalid value for ${error.property}`;
          })
          .join("; ");
        throw new AppError(`Validation failed: ${errorMessages}`, 400);
      }

      if (req.method === "GET") {
        req.query = instance as any;
      } else {
        req.body = instance;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}