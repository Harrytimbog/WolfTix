import { NextFunction, Request, Response } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

export const errorhandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handling request validation errors
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // Handling database errors

  if (err instanceof DatabaseConnectionError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
