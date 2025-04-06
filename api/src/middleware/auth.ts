import type { Request, Response } from "express";
import { deleteSessionTokenCookie, validateSessionToken } from "../lib/session.js";

export async function auth(req: Request, res: Response, next: (err?: any) => void) {
  const token = req.cookies['session'];

  res.locals.user = null;
  res.locals.session = null;

  if (token) {
    const { session, user } = await validateSessionToken(token);

    if (!session || !user) {
      deleteSessionTokenCookie(res);
    } else {
      await validateSessionToken(token);

      res.locals.user = user;
      res.locals.session = session;
    }
  }

  next();
}

// Use in routes that require auth
export async function authGuard(req: Request, res: Response, next: (err?: any) => void) {
  if (!res.locals.user || !res.locals.session) {
    res.status(401).json({
      message: 'Unauthorized'
    });

    return;
  }

  next();
}
