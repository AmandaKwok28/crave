import { Session, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
