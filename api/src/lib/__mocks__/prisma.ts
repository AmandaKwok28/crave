import { PrismaClient } from '@prisma/client';
import { beforeEach, vi } from 'vitest';
import { mockDeep, mockReset, type DeepMockProxy } from 'vitest-mock-extended';

beforeEach(() => {
  mockReset(prisma);
});

// https://github.com/prisma/prisma/issues/10203
export const prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<{
  // required
  [K in keyof PrismaClient]: Omit<PrismaClient[K], "groupBy">;
}>;
