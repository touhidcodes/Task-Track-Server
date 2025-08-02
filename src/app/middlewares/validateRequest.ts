import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

const validateRequest =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Restructure the request to match your schema expectation
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      return next(err);
    }
  };

export default validateRequest;
