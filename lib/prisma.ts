import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Use POSTGRES_URL (Vercel standard) or fallback to DATABASE_URL
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ 
    log: ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
