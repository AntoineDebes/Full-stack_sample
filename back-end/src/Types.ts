import { Request, Response } from "express";
import { Session } from "express-session";

interface ContextRequest extends Session {
  userId?: any;
}

export type MyContext = {
  req: Request & {
    session?: ContextRequest;
    cookie?: any;
  };
  res: Response;
};
