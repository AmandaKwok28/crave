import { Request, Response } from "express";
import { deleteSessionTokenCookie, validateSessionToken } from "../lib/session";

export async function auth(req: Request, res: Response, next: (err?: any) => void) {
  const token = req.cookies['session'];

  if (token) {
    const { session, user } = await validateSessionToken(token);

    if (!session || !user) {
      deleteSessionTokenCookie(res);
    } else {
      await validateSessionToken(token);
    }
  }

  next();
}

// Use in routes that require auth
export async function authGuard(req: Request, res: Response, next: (err?: any) => void) {
  const token = req.cookies['session'];

  if (!token) {
    res.status(401).json({
      message: 'Unauthorized'
    });

    return;
  }

  const { session, user } = await validateSessionToken(token);

  if (!session || !user) {
    deleteSessionTokenCookie(res);
    res.status(401).json({
      message: 'Unauthorized'
    });

    return;
  }

  await validateSessionToken(token);

  next();
}
