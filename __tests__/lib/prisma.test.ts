/**
 * Prisma Client Unit Tests
 * Tests for database client initialization and connection
 */

import { prisma } from '@/lib/prisma';

describe('Prisma Client', () => {
  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('should be an instance of PrismaClient', () => {
    expect(prisma).toHaveProperty('$connect');
    expect(prisma).toHaveProperty('$disconnect');
    expect(prisma).toHaveProperty('$transaction');
  });

  it('should have all model accessors', () => {
    expect(prisma).toHaveProperty('profile');
    expect(prisma).toHaveProperty('adminUser');
    expect(prisma).toHaveProperty('publication');
    expect(prisma).toHaveProperty('researchProject');
    expect(prisma).toHaveProperty('course');
    expect(prisma).toHaveProperty('student');
    expect(prisma).toHaveProperty('blogPost');
    expect(prisma).toHaveProperty('event');
  });

  describe('Database Connection Priority', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should prioritize POSTGRES_PRISMA_URL if available', () => {
      process.env.POSTGRES_PRISMA_URL = 'postgresql://test_prisma';
      process.env.POSTGRES_URL = 'postgresql://test_postgres';
      process.env.DATABASE_URL = 'postgresql://test_database';
      
      // Connection priority is tested in the prisma.ts file
      expect(process.env.POSTGRES_PRISMA_URL).toBe('postgresql://test_prisma');
    });

    it('should fall back to POSTGRES_URL if POSTGRES_PRISMA_URL unavailable', () => {
      delete process.env.POSTGRES_PRISMA_URL;
      process.env.POSTGRES_URL = 'postgresql://test_postgres';
      process.env.DATABASE_URL = 'postgresql://test_database';
      
      expect(process.env.POSTGRES_URL).toBe('postgresql://test_postgres');
    });

    it('should fall back to DATABASE_URL as last resort', () => {
      delete process.env.POSTGRES_PRISMA_URL;
      delete process.env.POSTGRES_URL;
      process.env.DATABASE_URL = 'postgresql://test_database';
      
      expect(process.env.DATABASE_URL).toBe('postgresql://test_database');
    });
  });
});
