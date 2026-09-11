import { PrismaClient } from '@prisma/client';
import { inMemoryDb } from './inMemoryDb';

const realPrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

let isPostgresAvailable = false;
let checkedConnection = false;

// Proxy wrapper that forwards to Prisma if PostgreSQL is live, or falls back to inMemoryDb
export const prisma: any = new Proxy({}, {
  get(_target, prop) {
    if (prop === '$connect') {
      return async () => {
        try {
          const connectPromise = realPrisma.$connect();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Postgres connection timeout')), 1500)
          );
          await Promise.race([connectPromise, timeoutPromise]);
          isPostgresAvailable = true;
          checkedConnection = true;
          console.log('✅ PostgreSQL connected');
          return true;
        } catch (err) {
          isPostgresAvailable = false;
          checkedConnection = true;
          console.log('⚡ Running with in-memory Vadodara heritage dataset (PostgreSQL offline).');
          return true;
        }
      };
    }
    if (prop === '$disconnect') {
      return async () => {
        if (isPostgresAvailable) {
          await realPrisma.$disconnect();
        }
      };
    }

    if (checkedConnection && !isPostgresAvailable) {
      return (inMemoryDb as any)[prop];
    }

    const prismaMember = (realPrisma as any)[prop];
    if (typeof prismaMember === 'object' && prismaMember !== null) {
      return new Proxy(prismaMember, {
        get(subTarget, subProp) {
          const fn = subTarget[subProp];
          if (typeof fn === 'function') {
            return async (...args: any[]) => {
              if (checkedConnection && !isPostgresAvailable) {
                const fallbackSub = (inMemoryDb as any)[prop];
                if (fallbackSub && typeof fallbackSub[subProp] === 'function') {
                  return fallbackSub[subProp](...args);
                }
              }
              try {
                return await fn.apply(subTarget, args);
              } catch (error) {
                isPostgresAvailable = false;
                const fallbackSub = (inMemoryDb as any)[prop];
                if (fallbackSub && typeof fallbackSub[subProp] === 'function') {
                  return fallbackSub[subProp](...args);
                }
                throw error;
              }
            };
          }
          return fn;
        },
      });
    }

    return prismaMember;
  },
});

export default prisma;
