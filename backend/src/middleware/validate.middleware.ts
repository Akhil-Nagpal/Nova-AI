import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
      file: req.file,
    });
    next();
  };
