// import { plainToInstance } from "class-transformer";
// import { validate } from "class-validator";
// import { Request, Response, NextFunction } from "express";

// export const validateRequest = (DTOClass: any) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const dtoObj = plainToInstance(DTOClass, req.body);
//     const errors = await validate(dtoObj);

//     if (errors.length > 0) {
//       const message = Object.values(errors[0].constraints!)[0];
//       res.status(400).json({ message });
//       return 
//     }

//     req.body = dtoObj;
//     next();
//   };
// };


// import { Request, Response, NextFunction } from "express";
// import { plainToInstance } from "class-transformer";
// import { validate, ValidationError } from "class-validator";
// import { AppError } from "../utils/AppError.js";

// export function validateRequest<T extends object>(dtoClass: new () => T) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       console.log(
//         `[validateRequest] Method: ${req.method}, Path: ${req.path}, Body: ${JSON.stringify(
//           req.body
//         )}, Query: ${JSON.stringify(req.query)}`
//       );

//       let instance: T;
//       if (req.method === "GET") {
//         // For GET requests, validate query parameters
//         instance = plainToInstance(dtoClass, req.query);
//       } else {
//         // For other methods (POST, PUT, etc.), validate body
//         if (Object.keys(req.body).length === 0) {
//           console.log("[validateRequest] Empty request body detected");
//           throw new AppError("Request body is required", 400);
//         }
//         instance = plainToInstance(dtoClass, req.body);
//       }

//       const errors: ValidationError[] = await validate(instance, {
//         skipMissingProperties: false,
//         forbidUnknownValues: true,
//       });

//       if (errors.length > 0) {
//         const errorMessages = errors
//           .map((error) => {
//             if (error.constraints) {
//               return Object.values(error.constraints).join(", ");
//             }
//             return `Invalid value for ${error.property}`;
//           })
//           .join("; ");
//         console.log("[validateRequest] Validation errors:", errorMessages);
//         throw new AppError(`Validation failed: ${errorMessages}`, 400);
//       }

//       // Attach validated data to request
//       if (req.method === "GET") {
//         req.query = instance as any;
//       } else {
//         req.body = instance;
//       }
//       next();
//     } catch (error) {
//       console.error("[validateRequest] Error:", error);
//       next(error);
//     }
//   };
// }

import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { AppError } from "../utils/AppError.js";

export function validateRequest<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(
        `[validateRequest] Method: ${req.method}, Path: ${req.path}, Body: ${JSON.stringify(
          req.body
        )}, Query: ${JSON.stringify(req.query)}`
      );
      console.log("[validateRequest] Raw req.body:", req.body);

      let instance: T;
      if (req.method === "GET") {
        // For GET requests, validate query parameters
        instance = new dtoClass();
        Object.assign(instance, req.query);
      } else {
        // For other methods (POST, PUT, etc.), validate body
        if (Object.keys(req.body).length === 0 && req.method !== "GET") {
          console.log("[validateRequest] Empty request body detected");
          throw new AppError("Request body is required", 400);
        }
        console.log("[validateRequest] Before DTO creation:", req.body);
        instance = new dtoClass();
        Object.assign(instance, req.body);
        console.log("[validateRequest] After DTO creation:", instance);
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
        console.log("[validateRequest] Validation errors:", errorMessages);
        throw new AppError(`Validation failed: ${errorMessages}`, 400);
      }

      if (req.method === "GET") {
        req.query = instance as any;
      } else {
        req.body = instance;
      }
      next();
    } catch (error) {
      console.error("[validateRequest] Error:", error);
      next(error);
    }
  };
}