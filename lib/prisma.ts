import { PrismaClient } from "@prisma/client";

function hasRealDatabaseConfig() {
  const configuredUrl = [process.env.DATABASE_URL, process.env.DIRECT_URL]
    .filter(Boolean)
    .join("");

  if (!configuredUrl.trim()) {
    return false;
  }

  return !configuredUrl.includes("[HOST]") && !configuredUrl.includes("YOUR_");
}

function createFallbackPrismaClient() {
  const createModelProxy = () =>
    new Proxy(
      {},
      {
        get(_target, prop) {
          if (typeof prop !== "string") {
            return undefined;
          }

          if (prop.startsWith("$")) {
            return async () => undefined;
          }

          const handlers: Record<string, (...args: unknown[]) => unknown> = {
            findMany: async () => [],
            findUnique: async () => null,
            findUniqueOrThrow: async () => ({ id: "demo-fallback-id" }),
            findFirst: async () => null,
            count: async () => 0,
            groupBy: async () => [],
            create: async () => ({
              id: "demo-fallback-id",
            }),
            update: async () => ({
              id: "demo-fallback-id",
            }),
            upsert: async () => ({
              id: "demo-fallback-id",
            }),
            delete: async () => ({ id: "demo-fallback-id" }),
            createMany: async () => ({ count: 0 }),
            updateMany: async () => ({ count: 0 }),
            deleteMany: async () => ({ count: 0 }),
          };

          return handlers[prop] ?? (async () => null);
        },
      }
    );

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop !== "string") {
          return undefined;
        }

        if (prop.startsWith("$")) {
          return async () => undefined;
        }

        return createModelProxy();
      },
    }
  ) as PrismaClient;
}

// Prevents exhausting the database connection pool during Next.js dev hot
// reloads, which would otherwise create a brand new PrismaClient (and a new
// connection pool) on every file save.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  if (!hasRealDatabaseConfig()) {
    return createFallbackPrismaClient();
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// Constructing PrismaClient eagerly at module scope would run the moment
// this file is imported — including during `next build`'s page-data
// collection step, before `prisma generate` has ever run against a real
// schema. Wrapping it in a Proxy defers the actual `new PrismaClient()`
// call until the first time a query is made, which only happens at request
// time (by which point `prisma generate` has run in any real deployment).
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    globalForPrisma.prisma ??= createPrismaClient();
    return Reflect.get(globalForPrisma.prisma, prop, receiver);
  },
});
