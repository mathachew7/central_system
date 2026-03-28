import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const REQUEST_ID_HEADER = "x-request-id";

export const requestContext = (request: Request, response: Response, next: NextFunction): void => {
  const incomingId = request.header(REQUEST_ID_HEADER);
  const requestId = incomingId && incomingId.length > 0 ? incomingId : uuidv4();

  request.requestId = requestId;
  response.setHeader(REQUEST_ID_HEADER, requestId);

  next();
};
